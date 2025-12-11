import { useState } from 'react';
import { Code, Upload, Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard, getBaseUrl } from '@/lib/utils';

export function WidgetPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const widgetCode = `<!-- URLGPT Widget -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${getBaseUrl()}/widget.js';
    s.async = true;
    document.head.appendChild(s);
  })();
</script>`;

  const handleCopyCode = async () => {
    await copyToClipboard(widgetCode);
    toast({
      title: 'Copied!',
      description: 'Widget code copied to clipboard',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an HTML file',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const text = await file.text();
      
      // Check if widget code already exists
      if (text.includes('URLGPT Widget')) {
        toast({
          title: 'Already embedded',
          description: 'This HTML file already contains the URLGPT widget',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Insert widget code before closing </body> tag
      let modifiedHtml = text;
      if (modifiedHtml.includes('</body>')) {
        modifiedHtml = modifiedHtml.replace(
          '</body>',
          `  ${widgetCode}\n</body>`
        );
      } else if (modifiedHtml.includes('</html>')) {
        modifiedHtml = modifiedHtml.replace(
          '</html>',
          `  ${widgetCode}\n</html>`
        );
      } else {
        modifiedHtml += `\n${widgetCode}`;
      }

      // Create download link
      const blob = new Blob([modifiedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.html', '-with-urlgpt.html');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success!',
        description: 'Your HTML file has been downloaded with the URLGPT widget embedded',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process HTML file',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold glow-text mb-2">Embeddable Widget</h2>
            <p className="text-muted-foreground">
              Add URLGPT to any website with a single line of code
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="cyber-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Embed Code</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Copy this code and paste it before the closing &lt;/body&gt; tag in your HTML
              </p>
              <div className="bg-background rounded-lg p-4 mb-4 border border-primary/20">
                <pre className="text-xs text-primary overflow-x-auto terminal-text">
                  {widgetCode}
                </pre>
              </div>
              <Button onClick={handleCopyCode} className="w-full cyber-button">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="cyber-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Auto Embed</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Upload your HTML file and we'll automatically inject the widget code
              </p>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center mb-4 hover:border-primary/60 transition-colors">
                <input
                  type="file"
                  accept=".html"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="html-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="html-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-foreground font-medium mb-1">
                    {isProcessing ? 'Processing...' : 'Click to upload'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    HTML files only
                  </p>
                </label>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="w-4 h-4" />
                <span>Modified file will download automatically</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-card p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Widget Preview</h3>
            <div className="bg-background rounded-lg p-8 border border-primary/20">
              <div className="max-w-md mx-auto text-center">
                <div className="inline-block">
                  <div className="w-14 h-14 rounded-full shadow-cyber-glow-lg cursor-pointer hover:scale-110 transition-transform overflow-hidden">
                    <img 
                      src="https://cdn-ai.onspace.ai/onspace/files/GPyTSpPocHTrri5ywNrK8f/5963259a7_5a60156c-c371-4523-82a7-0845fe34cebb.jpeg" 
                      alt="URLGPT Widget" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  The widget will appear as a floating button in the bottom-right corner of your website
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
