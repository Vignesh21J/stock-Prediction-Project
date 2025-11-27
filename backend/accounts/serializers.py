from rest_framework import serializers

from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4, style={'input_type':'password'})  # Always the Password fields should be set(written by the User), it should not be retrived from GET req. So we used attr: write_only=True
    class Meta:
        model = User
        fields = ['username','email','password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value



    # User has to be created in our DB, so that is handled here itself.
    
    # create() is a member function,  # why validated_data in params? Bcoz automatically validates the data that we entered in the form, and this is done by serializer. After that, that validated_data will be passed in create()
    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )

        # user = User.objects.create_user(**validated_data)   # Only proper fields(username, email, password, super_user) like this, here it will accepted.
        # If not like that means, use like above..

        return user
    