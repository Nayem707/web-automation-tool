import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const JsonExporter = ({ data, filename = 'players-data' }) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    const dataStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('Data copied to clipboard!');
    });
  };

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const itemCount = Array.isArray(data) ? data.length : Object.keys(data).length;

  return (
    <Card title="Export Results" subtitle={`${itemCount} item(s) ready for download`}>
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Your scraped data is ready. Download as JSON or copy to clipboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExport}>📥 Download JSON</Button>
          <Button onClick={handleCopyToClipboard} variant="ghost">
            📋 Copy to Clipboard
          </Button>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="font-mono text-xs text-gray-600">
            {itemCount} records • {(JSON.stringify(data).length / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
    </Card>
  );
};

export default JsonExporter;
