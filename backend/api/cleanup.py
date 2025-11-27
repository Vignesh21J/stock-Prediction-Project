import os
from django.conf import settings

def delete_old_plots(ticker):
    media_path = settings.MEDIA_ROOT

    prefixes = [
        f"{ticker}_plot",
        f"{ticker}_100_DMA",
        f"{ticker}_200_DMA",
        f"{ticker}_final_prediction",
    ]

    deleted_files = []

    for file_name in os.listdir(media_path):

        for prefix in prefixes:

            if file_name.startswith(prefix) and file_name.endswith(".png"):
                file_path = os.path.join(media_path, file_name)

                try:
                    os.remove(file_path)
                    deleted_files.append(file_name)
                except Exception:
                    pass

    return deleted_files

