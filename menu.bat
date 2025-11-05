@echo off
setlocal enabledelayedexpansion
title Menu Avançado - Utilitários do Sistema
color 0a

:menu_principal
cls
echo ========================================
echo        MENU DE UTILITÁRIOS (v2.0)
echo ========================================
echo 1.  Abrir Bloco de Notas
echo 2.  Mostrar data e hora
echo 3.  Listar arquivos da pasta atual
echo 4.  Verificar espaço em disco
echo 5.  Testar conexão com a internet
echo 6.  Limpar arquivos temporários
echo 7.  Fazer backup de uma pasta
echo 8.  Reiniciar o Explorador do Windows
echo 9.  Abrir um site no navegador
echo 10. Sair
echo ========================================
set /p "opcao=Escolha uma opcao (1-10): "

if "%opcao%"=="1" goto notepad
if "%opcao%"=="2" goto data_hora
if "%opcao%"=="3" goto listar_arquivos
if "%opcao%"=="4" goto espaco_disco
if "%opcao%"=="5" goto ping_google
if "%opcao%"=="6" goto limpar_temp
if "%opcao%"=="7" goto backup
if "%opcao%"=="8" goto reiniciar_explorer
if "%opcao%"=="9" goto abrir_site
if "%opcao%"=="10" goto sair

echo [ERRO] Opcao invalida! Tente novamente.
timeout /t 2 >nul
goto menu_principal

:: ================ FUNÇÕES ================
:notepad
notepad
goto menu_principal

:data_hora
echo.
echo [DATA E HORA ATUAIS]
date /t
time /t
pause
goto menu_principal

:listar_arquivos
echo.
echo [ARQUIVOS NA PASTA ATUAL]
dir /b
pause
goto menu_principal

:espaco_disco
echo.
echo [ESPAÇO EM DISCO - UNIDADE C:]
wmic logicaldisk where "DeviceID='C:'" get FreeSpace,Size /format:list
pause
goto menu_principal

:ping_google
echo.
echo [TESTANDO CONEXÃO...]
ping -n 1 google.com >nul && (
    echo Conexao ativa! 
) || (
    echo [ERRO] Sem conexao com a internet.
)
pause
goto menu_principal

:limpar_temp
echo.
echo [LIMPANDO ARQUIVOS TEMP...]
del /q/f/s "%TEMP%\*" >nul 2>&1
rd /s/q "%TEMP%" >nul 2>&1
md "%TEMP%"
echo Limpeza concluida!
pause
goto menu_principal

:backup
echo.
set /p "origem=Digite o caminho da pasta a ser backupada (ex: C:\Dados): "
set /p "destino=Digite o destino do backup (ex: D:\Backup): "
if not exist "%origem%" (
    echo [ERRO] Pasta de origem nao existe!
    pause
    goto menu_principal
)
xcopy "%origem%" "%destino%_%date:~-4,4%%date:~-7,2%%date:~-10,2%" /e /i /h /y >nul
echo Backup criado em %destino%!
pause
goto menu_principal

:reiniciar_explorer
echo.
echo [REINICIANDO EXPLORADOR DO WINDOWS...]
taskkill /f /im explorer.exe >nul
start explorer.exe
echo Concluido!
timeout /t 3 >nul
goto menu_principal

:abrir_site
echo.
set /p "url=Digite a URL (ex: https://www.google.com): "
start "" "%url%"
goto menu_principal

:sair
echo Saindo...
timeout /t 1 >nul
exit
