/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { Download, Copy, Send, Code2, FileJson, Database, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { faker } from '@faker-js/faker';

// Define proper interfaces for our data structures
interface GeneratedDataItem {
  id: number;
  [key: string]: string | number | boolean;
}

interface ExamplePrompt {
  text: string;
  icon: string;
}

interface FieldMapping {
  patterns: string[];
  exact?: boolean;
  exclude?: string[];
  generator: () => any;
  description?: string;
}

// Define function types
type DataGeneratorFunction = (fields: string[], count: number) => GeneratedDataItem[];
type CSVConverterFunction = (data: GeneratedDataItem[]) => string;
type SQLConverterFunction = (data: GeneratedDataItem[], tableName: string) => string;

const FakeDataGenerator = () => {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [format, setFormat] = useState<string>('json');
  const [count, setCount] = useState<number>(10);
  const [generatedData, setGeneratedData] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tableName, setTableName] = useState<string>('data_table');

  const examplePrompts: ExamplePrompt[] = [
    { text: "user with email password firstname lastname age", icon: "👤" },
    { text: "product with name price category stock sku rating", icon: "🛍️" },
    { text: "order with orderid customer total status date", icon: "📦" },
    { text: "employee with name department salary email phone jobtitle", icon: "💼" },
    { text: "post with title author content views likes createdat", icon: "📝" },
    { text: "transaction with id amount currency status timestamp", icon: "💳" },
    { text: "customer with firstname lastname email phone address city country", icon: "🌍" },
    { text: "article with title author description url image publishdate", icon: "📰" }
  ];

  // Comprehensive field mapping configuration
  const fieldMappings: FieldMapping[] = useMemo(() => [
    { patterns: ['email', 'mail'], exact: false, generator: () => faker.internet.email(), description: 'Email address' },
    { patterns: ['password', 'pwd', 'pass'], generator: () => faker.internet.password({ length: 12 }), description: 'Password' },
    { patterns: ['first', 'firstname', 'fname'], generator: () => faker.person.firstName(), description: 'First name' },
    { patterns: ['last', 'lastname', 'lname', 'surname'], generator: () => faker.person.lastName(), description: 'Last name' },
    { patterns: ['name', 'fullname'], exact: true, generator: () => faker.person.fullName(), description: 'Full name' },
    { patterns: ['user', 'username'], exclude: ['id'], generator: () => faker.internet.username(), description: 'Username' },
    { patterns: ['age'], generator: () => faker.number.int({ min: 18, max: 68 }), description: 'Age' },
    { patterns: ['phone', 'mobile', 'tel'], generator: () => faker.phone.number(), description: 'Phone number' },
    { patterns: ['address', 'street'], generator: () => faker.location.streetAddress(), description: 'Street address' },
    { patterns: ['city'], generator: () => faker.location.city(), description: 'City' },
    { patterns: ['state', 'province'], generator: () => faker.location.state({ abbreviated: true }), description: 'State' },
    { patterns: ['country', 'nation'], generator: () => faker.location.country(), description: 'Country' },
    { patterns: ['zip', 'postal', 'zipcode'], generator: () => faker.location.zipCode(), description: 'Zip code' },
    { patterns: ['price', 'cost'], generator: () => faker.commerce.price({ min: 10, max: 1000, dec: 2 }), description: 'Price' },
    { patterns: ['amount', 'total', 'salary', 'wage', 'income'], generator: () => faker.commerce.price({ min: 100, max: 10000, dec: 2 }), description: 'Amount' },
    { patterns: ['currency'], generator: () => faker.finance.currencyCode(), description: 'Currency code' },
    { patterns: ['date', 'createdat', 'updatedat'], generator: () => faker.date.past({ years: 1 }).toISOString(), description: 'Date' },
    { patterns: ['time', 'timestamp'], generator: () => faker.date.recent({ days: 30 }).toISOString(), description: 'Timestamp' },
    { patterns: ['status'], generator: () => faker.helpers.arrayElement(['active', 'inactive', 'pending', 'completed', 'cancelled']), description: 'Status' },
    { patterns: ['is', 'has', 'verified', 'enabled'], generator: () => faker.datatype.boolean(), description: 'Boolean' },
    { patterns: ['category', 'type', 'department'], generator: () => faker.commerce.department(), description: 'Category' },
    { patterns: ['stock', 'quantity', 'qty', 'inventory'], generator: () => faker.number.int({ min: 0, max: 1000 }), description: 'Quantity' },
    { patterns: ['rating', 'score'], generator: () => faker.number.float({ min: 0, max: 5, fractionDigits: 1 }), description: 'Rating' },
    { patterns: ['view', 'like', 'count', 'follower', 'subscriber'], generator: () => faker.number.int({ min: 0, max: 10000 }), description: 'Count' },
    { patterns: ['description', 'content', 'bio', 'about', 'summary'], generator: () => faker.lorem.paragraph(), description: 'Text content' },
    { patterns: ['title', 'heading', 'subject'], generator: () => faker.lorem.sentence({ min: 3, max: 6 }), description: 'Title' },
    { patterns: ['sku', 'code', 'serial'], generator: () => faker.string.alphanumeric({ length: 10, casing: 'upper' }), description: 'SKU/Code' },
    { patterns: ['id'], exclude: ['id'], generator: () => faker.number.int({ min: 1000, max: 9999 }), description: 'ID' },
    { patterns: ['url', 'website', 'link'], generator: () => faker.internet.url(), description: 'URL' },
    { patterns: ['image', 'photo', 'avatar', 'picture', 'thumbnail'], generator: () => faker.image.avatar(), description: 'Image URL' },
    { patterns: ['company', 'organization', 'business'], generator: () => faker.company.name(), description: 'Company' },
    { patterns: ['job', 'position', 'role', 'jobtitle'], generator: () => faker.person.jobTitle(), description: 'Job title' },
    { patterns: ['gender', 'sex'], generator: () => faker.person.sex(), description: 'Gender' },
    { patterns: ['color', 'colour'], generator: () => faker.color.human(), description: 'Color' },
    { patterns: ['product', 'item'], exact: false, generator: () => faker.commerce.productName(), description: 'Product' },
    { patterns: ['brand', 'manufacturer'], generator: () => faker.company.name(), description: 'Brand' },
    { patterns: ['tag', 'label', 'keyword'], generator: () => faker.word.noun(), description: 'Tag' },
    { patterns: ['slug', 'permalink'], generator: () => faker.helpers.slugify(faker.lorem.words(3)), description: 'Slug' },
    { patterns: ['ip', 'ipaddress'], generator: () => faker.internet.ip(), description: 'IP address' },
    { patterns: ['mac', 'macaddress'], generator: () => faker.internet.mac(), description: 'MAC address' },
    { patterns: ['domain'], generator: () => faker.internet.domainName(), description: 'Domain' },
    { patterns: ['author', 'creator', 'owner'], generator: () => faker.person.fullName(), description: 'Author' },
    { patterns: ['customer', 'client'], generator: () => faker.person.fullName(), description: 'Customer' },
    { patterns: ['uuid', 'guid'], generator: () => faker.string.uuid(), description: 'UUID' },
    { patterns: ['latitude', 'lat'], generator: () => faker.location.latitude(), description: 'Latitude' },
    { patterns: ['longitude', 'lng', 'lon'], generator: () => faker.location.longitude(), description: 'Longitude' },
  ], []);

  const matchFieldToGenerator = (field: string): (() => any) => {
    const lowerField = field.toLowerCase();
    
    for (const mapping of fieldMappings) {
      if (mapping.exclude?.some(ex => lowerField.includes(ex))) continue;
      
      const matches = mapping.patterns.some(pattern => 
        mapping.exact ? lowerField === pattern : lowerField.includes(pattern)
      );
      
      if (matches) return mapping.generator;
    }
    
    return () => faker.word.sample();
  };

  const parseFieldsFromPrompt = (prompt: string): string[] => {
    const cleaned = prompt.toLowerCase()
      .replace(/^(generate|create|make|build)\s+/i, '')
      .replace(/\s+(with|having|including|contains?)\s+/i, ' ')
      .trim();

    const fields = cleaned.split(/[\s,]+(?:and\s+)?/)
      .filter((f: string) => f && f.length > 1)
      .filter((f: string) => !['with', 'and', 'or', 'the', 'a', 'an'].includes(f));

    const dataTypeWords = ['user', 'users', 'product', 'products', 'order', 'orders', 'employee', 'employees', 'post', 'posts', 'item', 'items', 'record', 'records', 'customer', 'customers', 'article', 'articles'];
    if (fields.length > 0 && dataTypeWords.includes(fields[0])) {
      fields.shift();
    }

    return fields.map((f: string): string => {
      if (f.includes('_')) return f;
      return f.replace(/\s+/g, '');
    }).filter((f: string): boolean => f.length > 0);
  };

  const generateDataFromPrompt = (): void => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout((): void => {
      const fields = parseFieldsFromPrompt(userPrompt);
      const data = generateSmartData(fields, count);
      
      let formatted: string;
      switch(format) {
        case 'json':
          formatted = JSON.stringify(data, null, 2);
          break;
        case 'csv':
          formatted = convertToCSV(data);
          break;
        case 'sql':
          formatted = convertToSQL(data, tableName);
          break;
        default:
          formatted = JSON.stringify(data, null, 2);
      }
      
      setGeneratedData(formatted);
      setIsGenerating(false);
    }, 300);
  };

  const generateSmartData: DataGeneratorFunction = (fields: string[], n: number): GeneratedDataItem[] => {
    if (!fields || fields.length === 0) {
      return Array.from({ length: n }, (_, i: number): GeneratedDataItem => ({ id: i + 1 }));
    }
    
    return Array.from({ length: n }, (_, i: number): GeneratedDataItem => {
      const item: GeneratedDataItem = { id: i + 1 };
      
      fields.forEach((field: string): void => {
        const generator = matchFieldToGenerator(field);
        (item as any)[field] = generator();
      });
      
      return item;
    });
  };

  const convertToCSV: CSVConverterFunction = (data: GeneratedDataItem[]): string => {
    if (!data || data.length === 0) return '';
    const headers: string[] = Object.keys(data[0]);
    const rows: string[] = data.map((row: GeneratedDataItem): string => 
      headers.map((header: string): string => {
        const value: string | number | boolean = row[header];
        if (value === null || value === undefined) return '';
        const stringValue: string = String(value);
        return stringValue.includes(',') || stringValue.includes('"') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
      }).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  const convertToSQL: SQLConverterFunction = (data: GeneratedDataItem[], tableName: string): string => {
    if (!data || data.length === 0) return '';
    const headers: string[] = Object.keys(data[0]);
    const values: string = data.map((row: GeneratedDataItem): string => 
      `(${headers.map((h: string): string => {
        const val: string | number | boolean = row[h];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        if (typeof val === 'number') return String(val);
        return `'${String(val).replace(/'/g, "''")}'`;
      }).join(', ')})`
    ).join(',\n  ');
    
    return `INSERT INTO ${tableName} (${headers.join(', ')})\nVALUES\n  ${values};`;
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(generatedData);
    setCopied(true);
    setTimeout((): void => setCopied(false), 2000);
  };

  const downloadFile = (): void => {
    const extensions: Record<string, string> = { json: 'json', csv: 'csv', sql: 'sql' };
    const blob: Blob = new Blob([generatedData], { type: 'text/plain' });
    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = `generated_data.${extensions[format]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const regenerateData = (): void => {
    if (generatedData) {
      generateDataFromPrompt();
    }
  };

  const formatIcons = {
    json: FileJson,
    csv: Database,
    sql: Code2
  };

  const dataStats = useMemo(() => {
    if (!generatedData) return null;
    const lines = generatedData.split('\n').length;
    const chars = generatedData.length;
    const size = (chars / 1024).toFixed(2);
    return { lines, chars, size };
  }, [generatedData]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">Mock Data Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Describe what you need and get instant realistic test data powered by Faker.js</p>
        </div>

        {/* Main Input Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg mb-6">
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Describe your data structure
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setUserPrompt(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => { if (e.key === 'Enter') generateDataFromPrompt(); }}
                  placeholder="user with email password firstname lastname"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  onClick={generateDataFromPrompt}
                  disabled={!userPrompt || isGenerating}
                  className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-500 mb-2">Quick start examples:</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {examplePrompts.slice(0, 4).map((prompt: ExamplePrompt, i: number) => (
                  <button
                    key={i}
                    onClick={(): void => setUserPrompt(prompt.text)}
                    className="text-xs px-3 py-2 bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all border border-gray-200 text-left"
                  >
                    <span className="mr-1">{prompt.icon}</span>
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Format and Count Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['json', 'csv', 'sql'] as const).map((fmt: string) => {
                    const Icon = formatIcons[fmt as keyof typeof formatIcons];
                    return (
                      <button
                        key={fmt}
                        onClick={(): void => setFormat(fmt)}
                        className={`px-3 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          format === fmt
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm font-semibold uppercase">{fmt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of records: <span className="text-blue-600">{count}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {format === 'sql' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Table Name</label>
                  <input
                    type="text"
                    value={tableName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTableName(e.target.value)}
                    placeholder="data_table"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generated Data Output */}
        {generatedData && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  Generated Data
                </h2>
                {dataStats && (
                  <p className="text-xs text-gray-500 mt-1">
                    {dataStats.lines} lines • {dataStats.size} KB
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={regenerateData}
                  className="px-3 py-2 text-sm border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
                  title="Regenerate with new random data"
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 text-sm border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
                >
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadFile}
                  className="px-3 py-2 text-sm bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all flex items-center gap-2 font-medium shadow-md"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono">{generatedData}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Sparkles size={18} />
            Supported Field Types (50+ patterns powered by Faker.js)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-semibold mb-1.5">👤 Identity</div>
              <div className="text-xs text-blue-700">email, password, username, firstname, lastname, gender, age</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">📍 Contact</div>
              <div className="text-xs text-blue-700">phone, address, city, state, country, zip, latitude, longitude</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">💰 Financial</div>
              <div className="text-xs text-blue-700">price, amount, salary, currency, total</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">📝 Content</div>
              <div className="text-xs text-blue-700">title, description, content, bio, status, color, product</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">💼 Business</div>
              <div className="text-xs text-blue-700">company, job, department, brand</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">🌐 Web</div>
              <div className="text-xs text-blue-700">url, domain, ip, mac, uuid, slug</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">📊 Metrics</div>
              <div className="text-xs text-blue-700">rating, score, views, likes, count</div>
            </div>
            <div>
              <div className="font-semibold mb-1.5">📦 E-commerce</div>
              <div className="text-xs text-blue-700">sku, stock, category, quantity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeDataGenerator;