# Ollama Setup for Lister AI

## Install Ollama (Windows)

1. **Download Ollama:**
   - Go to https://ollama.com/download
   - Click "Download for Windows"
   - Run the installer (OllamaSetup.exe)

2. **Verify Installation:**
   - Open a NEW terminal/PowerShell window
   - Type: `ollama --version`
   - You should see the version number

3. **If command not found:**
   - Restart your computer
   - Or add to PATH: `C:\Users\YourUsername\AppData\Local\Programs\Ollama`

## Create Your Custom Model

Run these commands in your terminal:

```bash
# Pull the base model
ollama pull llama3.2

# Create Modelfile
echo "FROM llama3.2" >> Modelfile
echo "SYSTEM You are a friendly coding tutor created by Lister. Help students learn programming with clear, encouraging explanations. Keep responses concise and practical." >> Modelfile

# Create your custom model
ollama create somgiri61/Lister -f Modelfile

# (Optional) Push to Ollama registry
ollama push somgiri61/Lister
```

## Start Ollama Server

```bash
ollama serve
```

The server runs on `http://localhost:11434`

## How It Works

- **Complex questions** → Uses Ollama (Llama 3.2)
- **Simple questions** → Uses built-in AI (instant)
- **Ollama offline** → Automatically falls back to built-in AI

## Benefits

✅ **100% Free** - No API keys needed
✅ **Fully Local** - Your data stays private
✅ **Offline capable** - Works without internet
✅ **Smart fallback** - Never breaks if Ollama is down
✅ **ChatGPT-level** - Powered by Llama 3.2

## Test It

Ask complex questions like:
- "Explain in detail how JavaScript closures work"
- "Tell me everything about React hooks"
- "Give me a comprehensive guide to async/await"

The AI will use Ollama for deep explanations!
