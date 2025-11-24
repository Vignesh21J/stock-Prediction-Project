from django.shortcuts import render

from rest_framework.views import APIView

from .serializers import StockPredictionSerializer

from rest_framework import status
from rest_framework.response import Response



import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf
from datetime import datetime



# import os
# from django.conf import settings

from .utils import save_plot

from sklearn.preprocessing import MinMaxScaler


from keras.models import load_model




from django.core.cache import cache

from .cleanup import delete_old_plots





# Create your views here.


class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data = request.data)

        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']


            # STEP 1: CHECK CACHE FIRST
            cache_key = f"stock_prediction_{ticker}"
            cached_response = cache.get(cache_key)

            if cached_response:
                print("Serving from CACHE:", ticker)
                return Response(cached_response)
            

            print("CACHE MISS. Generating fresh data for:", ticker)
            
            print("CACHE MISS. Cleaning old images for:", ticker)
            deleted = delete_old_plots(ticker)
            print("Deleted old files:", deleted)




            # STEP 2: FETCH & PROCESS DATA from yfinance
            now = datetime.now()
            start = datetime(now.year-10, now.month, now.day)
            end = now

            df = yf.download(ticker, start, end)
            #print(df)

            if df.empty:
                return Response({'error': "Invalid or delisted stock ticker", 'status': status.HTTP_404_NOT_FOUND})
            

            df = df.reset_index()


            # Generate Basic Plot

            plt.switch_backend('AGG')     # AGG = Anti-Grain Geometry
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Closing Price')

            plt.title(f'Closing Price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            
            plt.legend()

            # Save the plot
            plot_img_path = f'{ticker}_plot.png'
            # image_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)
            # plt.savefig(image_path)
            # plt.close()

            # plot_image = settings.MEDIA_URL + plot_img_path
            # print(plot_image)

            plot_image = save_plot(plot_img_path)




            # 100 Days Moving Average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))

            plt.plot(df.Close, label='Closing Price')
            plt.plot(ma100, 'r', label='100 Days Moving Average')

            plt.title(f'Closing Price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')

            plt.legend()

            # Save the plot
            plot_img_path = f'{ticker}_100_DMA.png'
            plot_100_DMA = save_plot(plot_img_path)

            
            
            # 200 Days Moving Average
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend('AGG')

            plt.figure(figsize=(12, 5))

            plt.plot(df.Close, label='Closing Price')
            plt.plot(ma100, 'r', label='100 Days Moving Average')
            plt.plot(ma200, 'g', label='200 Days Moving Average')
        
            plt.title('200 Days Moving Average')
            plt.xlabel('Days')
            plt.ylabel('Price')

            plt.legend()
            
            # Save the plot
            plot_img_path = f'{ticker}_200_DMA.png'
            plot_200_DMA = save_plot(plot_img_path)




            # Splitting data into Training & Testing datasets
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7): int(len(df))])

            # Scaling down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))

            # Load ML model
            model = load_model('stock_prediction_trained_model.keras')

            # Preparing Test Data
            past_100_days = data_training.tail(100)




            # 100% Data We need from Here..
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)

            input_data = scaler.fit_transform(final_df)

            x_test = []
            y_test = []

            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100: i])
                y_test.append(input_data[i, 0])

            x_test, y_test = np.array(x_test), np.array(y_test)


            # Making Predictions
            y_predicted = model.predict(x_test)


            # Revert the scaled prices to original price
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()


            # print('y_predicted=>', y_predicted)
            # print('y_test=>', y_test)

            # Plot the final Prediction
            plt.switch_backend('AGG')

            plt.figure(figsize=(12, 6))

            plt.plot(y_test, 'b', label='Original Price')
            plt.plot(y_predicted, 'r', label='Predicted Price')

            plt.title(f'Final Prediction for {ticker}')

            plt.xlabel('Days')
            plt.ylabel('Price')

            plt.legend()
            
            # Save the plot
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_final_prediction = save_plot(plot_img_path)



            # Model Evaluation
            from sklearn.metrics import mean_squared_error

            # Mean Squared Error (MSE)
            mse = mean_squared_error(y_test, y_predicted)

            # RMSE
            rmse = np.sqrt(mse)


            # R-Squared
            from sklearn.metrics import r2_score
            r2 = r2_score(y_test, y_predicted)



            # return Response({
            #     'status':'success',
            #     'plot_img':plot_image,
            #     'plot_100_dma':plot_100_DMA,
            #     'plot_200_dma':plot_200_DMA,
            #     'plot_prediction':plot_final_prediction,
            #     'mse':mse,
            #     'rmse':rmse,
            #     'r2':r2
            # })



            # STEP 3: CACHE THE RESULT
            response_data = {
                'status': 'success',
                'plot_img': plot_image,
                'plot_100_dma': plot_100_DMA,
                'plot_200_dma': plot_200_DMA,
                'plot_prediction': plot_final_prediction,
                'mse': mse,
                'rmse': rmse,
                'r2': r2,
            }

            # Cache for 6 hours (21600 seconds)
            cache.set(cache_key, response_data, timeout=21600)

            return Response(response_data)





            # try:
            #     df = yf.download(ticker, start, end)
            #     if df.empty:
            #         return Response({"error": "Invalid or delisted stock ticker"}, status=status.HTTP_404_NOT_FOUND)
            #     return Response({'status':'success', 'ticker':ticker})
            
            # except Exception as e:
            #     return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

