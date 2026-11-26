import re

from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.views import TokenObtainPairView as SimpleJWTTokenObtainPairView
from zeep import Client
from zeep.transports import Transport

from users.models import User
from users.serializers import (
    EmailTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)

SOAP_WSDL_URL = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'


class UserApiViewSet(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class EmailTokenObtainPairView(SimpleJWTTokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description='Usuario registrado correctamente',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                        'email': openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: 'Datos de registro inválidos',
        },
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'username': user.username, 'email': user.email},
            status=status.HTTP_201_CREATED,
        )


class PaisSoapView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'codigo',
                openapi.IN_PATH,
                description='Código ISO 3166-1 alfa-2 del país (ej. MX, ES, AR)',
                type=openapi.TYPE_STRING,
                required=True,
            ),
        ],
        responses={
            200: openapi.Response(
                description='Nombre y capital del país',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'pais': openapi.Schema(type=openapi.TYPE_STRING),
                        'capital': openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
            400: 'Código de país inválido',
            502: 'Servicio SOAP no disponible',
        },
    )
    def get(self, request, codigo):
        if not re.fullmatch(r'[A-Za-z]{2}', codigo):
            return Response(
                {'detail': 'El código de país debe ser un código ISO de 2 letras.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            transport = Transport(timeout=10)
            client = Client(SOAP_WSDL_URL, transport=transport)
            codigo_iso = codigo.upper()
            return Response({
                'pais': client.service.CountryName(codigo_iso),
                'capital': client.service.CapitalCity(codigo_iso),
            })
        except Exception:
            return Response(
                {'detail': 'No se pudo consultar el servicio SOAP de países.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )
