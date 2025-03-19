# Script PowerShell para gerar contexto de projeto para IA
# Este script analisa arquivos HTML, CSS e JavaScript e cria um arquivo Markdown 
# que pode ser usado como contexto para uma IA generativa.

# Configurações
$projetoPasta = "." # Pasta do projeto (padrão: pasta atual)
$arquivoSaida = "contexto-projeto.md" # Nome do arquivo Markdown de saída
$extensoes = @("*.html", "*.css", "*.js") # Extensões de arquivo para analisar

# Função para obter informações sobre a estrutura de um arquivo
function Get-FileStructure {
    param (
        [string]$filePath
    )
    
    if (-not (Test-Path $filePath)) {
        Write-Warning "Arquivo não encontrado: $filePath"
        return $null
    }
    
    $content = Get-Content -Path $filePath -ReadCount 0 -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if ($null -eq $content) {
        Write-Warning "Não foi possível ler o conteúdo do arquivo: $filePath"
        return $null
    }
    
    return [PSCustomObject]@{
        Path = $filePath
        Type = [System.IO.Path]::GetExtension($filePath).TrimStart('.')
        Size = (Get-Item $filePath).Length
        LastModified = (Get-Item $filePath).LastWriteTime
        Content = $content
    }
}

# Início do script principal
try {
    Write-Host "Iniciando a geração de contexto para IA..."

    # Lista todos os arquivos com as extensões definidas
    $arquivos = Get-ChildItem -Path $projetoPasta -Recurse -Include $extensoes -ErrorAction SilentlyContinue |
                Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\\.git\\" }

    $htmlCount = ($arquivos | Where-Object { $_.Extension -eq ".html" }).Count
    $cssCount = ($arquivos | Where-Object { $_.Extension -eq ".css" }).Count
    $jsCount = ($arquivos | Where-Object { $_.Extension -eq ".js" }).Count

    # Prepara o conteúdo Markdown
    $markdownContent = @"
# Contexto de Projeto para IA

Este documento contém uma visão geral do projeto para ser usado como contexto para uma IA generativa.

**Data de geração:** $(Get-Date -Format "dd/MM/yyyy HH:mm")

## Visão Geral do Projeto

Total de arquivos:
- HTML: $htmlCount arquivos
- CSS: $cssCount arquivos
- JavaScript: $jsCount arquivos

## Estrutura do Projeto
(arquivos | ForEach-Object { 
.
F
u
l
l
N
a
m
e
.
R
e
p
l
a
c
e
(
.
​
 FullName.Replace(projetoPasta, "").TrimStart('') } | Out-String)

## Arquivos Principais

"@

    # Processa cada arquivo e adiciona ao markdown
    foreach ($arquivo in $arquivos) {
        $fileInfo = Get-FileStructure -filePath $arquivo.FullName
        if ($null -eq $fileInfo) { continue }

        $fileCodeBlock = @"
```$($fileInfo.Type)
$($fileInfo.Content)
"@
(arquivo.Name)
Caminho: 
(
(fileInfo.Path)

Tipo: 
(
(fileInfo.Type)

Tamanho: 
(
[
m
a
t
h
]
:
:
R
o
u
n
d
(
([math]::Round(fileInfo.Size / 1024, 2)) KB

Última Modificação: 
(
(fileInfo.LastModified)

Código-fonte:
$fileCodeBlock

"@
}
try {
    $markdownContent | Out-File -FilePath $arquivoSaida -Encoding UTF8 -ErrorAction Stop
    Write-Host "Contexto gerado com sucesso! Arquivo salvo em: $arquivoSaida"
} catch {
    Write-Error "Erro ao salvar o arquivo de saída: $_"
}
} catch {
Write-Error "Erro ao gerar contexto: $_"
}

