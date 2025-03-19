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
        [string]$filePath,
        [string]$fileType
    )
    
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw -ErrorAction SilentlyContinue
        $fileInfo = [PSCustomObject]@{
            Path = $filePath
            Type = $fileType
            Size = (Get-Item $filePath).Length
            Lines = ($content -split "`n").Count
            Preview = ($content -split "`n" | Select-Object -First 10) -join "`n"
        }
        return $fileInfo
    } else {
        Write-Warning "Arquivo não encontrado: $filePath"
        return $null
    }
}

# Processar arquivos
$arquivos = Get-ChildItem -Path $projetoPasta -Include $extensoes -Recurse
$dadosArquivos = @()

foreach ($arquivo in $arquivos) {
    $tipoArquivo = $arquivo.Extension
    $dados = Get-FileStructure -filePath $arquivo.FullName -fileType $tipoArquivo
    if ($dados) {
        $dadosArquivos += $dados
    }
}

# Criar arquivo de saída
$dadosArquivos | ConvertTo-Json -Depth 3 | Out-File -FilePath $arquivoSaida -Encoding utf8
Write-Host "Arquivo de contexto gerado: $arquivoSaida"
