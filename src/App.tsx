/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Download, Copy, Send, Code2, FileJson, Database } from 'lucide-react';

// Define proper interfaces for our data structures
interface GeneratedDataItem {
  id: number;
  [key: string]: string | number | boolean;
}

interface ExamplePrompt {
  text: string;
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

  const examplePrompts: ExamplePrompt[] = [
    { text: "user with email password firstname and lastname" },
    { text: "product with name price category stock" },
    { text: "order with orderid customer total status date" },
    { text: "employee with name department salary email phone" },
    { text: "post with title author content views likes" },
    { text: "transaction with id amount currency status timestamp" }
  ];

  const parseFieldsFromPrompt = (prompt: string): string[] => {
    const cleaned = prompt.toLowerCase()
      .replace(/^(generate|create|make|build)\s+/i, '')
      .replace(/\s+(with|having|including|contains?)\s+/i, ' ')
      .trim();

    const fields = cleaned.split(/[\s,]+(?:and\s+)?/)
      .filter((f: string) => f && f.length > 1)
      .filter((f: string) => !['with', 'and', 'or', 'the', 'a', 'an'].includes(f));

    const dataTypeWords = ['user', 'users', 'product', 'products', 'order', 'orders', 'employee', 'employees', 'post', 'posts', 'item', 'items', 'record', 'records'];
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
          formatted = convertToSQL(data, 'data_table');
          break;
        default:
          formatted = JSON.stringify(data, null, 2);
      }
      
      setGeneratedData(formatted);
      setIsGenerating(false);
    }, 500);
  };

  const generateSmartData: DataGeneratorFunction = (fields: string[], n: number): GeneratedDataItem[] => {
    if (!fields || fields.length === 0) {
      return Array.from({ length: n }, (_, i: number): GeneratedDataItem => ({ id: i + 1 }));
    }
    
    return Array.from({ length: n }, (_, i: number): GeneratedDataItem => {
      const item: GeneratedDataItem = { id: i + 1 };
      
      fields.forEach((field: string): void => {
        const lowerField = field.toLowerCase();
        
        if (lowerField.includes('email') || lowerField === 'mail') {
          (item as any)[field] = generateEmail();
        }
        else if (lowerField.includes('password') || lowerField === 'pwd' || lowerField === 'pass') {
          (item as any)[field] = generatePassword();
        }
        else if (lowerField.includes('first') || lowerField === 'firstname' || lowerField === 'fname') {
          (item as any)[field] = generateFirstName();
        }
        else if (lowerField.includes('last') || lowerField === 'lastname' || lowerField === 'lname' || lowerField === 'surname') {
          (item as any)[field] = generateLastName();
        }
        else if (lowerField === 'name' || lowerField === 'fullname') {
          (item as any)[field] = `${generateFirstName()} ${generateLastName()}`;
        }
        else if (lowerField.includes('user') && !lowerField.includes('id')) {
          (item as any)[field] = generateUsername();
        }
        else if (lowerField.includes('age')) {
          (item as any)[field] = Math.floor(Math.random() * 50) + 18;
        }
        else if (lowerField.includes('phone') || lowerField.includes('mobile') || lowerField.includes('tel')) {
          (item as any)[field] = generatePhone();
        }
        else if (lowerField.includes('address') || lowerField.includes('street')) {
          (item as any)[field] = generateAddress();
        }
        else if (lowerField.includes('city')) {
          (item as any)[field] = generateCity();
        }
        else if (lowerField.includes('state') || lowerField.includes('province')) {
          (item as any)[field] = generateState();
        }
        else if (lowerField.includes('country') || lowerField.includes('nation')) {
          (item as any)[field] = generateCountry();
        }
        else if (lowerField.includes('zip') || lowerField.includes('postal')) {
          (item as any)[field] = generateZip();
        }
        else if (lowerField.includes('price') || lowerField.includes('cost') || lowerField.includes('amount') || lowerField.includes('total') || lowerField.includes('salary')) {
          (item as any)[field] = (Math.random() * 1000 + 10).toFixed(2);
        }
        else if (lowerField.includes('currency')) {
          (item as any)[field] = ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)];
        }
        else if (lowerField.includes('date') || lowerField.includes('time') || lowerField.includes('created') || lowerField.includes('updated')) {
          (item as any)[field] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
        }
        else if (lowerField.includes('status')) {
          (item as any)[field] = ['active', 'inactive', 'pending', 'completed', 'cancelled'][Math.floor(Math.random() * 5)];
        }
        else if (lowerField.includes('is') || lowerField.includes('has') || lowerField.includes('verified') || lowerField.includes('active')) {
          (item as any)[field] = Math.random() > 0.5;
        }
        else if (lowerField.includes('category') || lowerField.includes('type') || lowerField.includes('department')) {
          (item as any)[field] = ['Type A', 'Type B', 'Type C', 'Type D'][Math.floor(Math.random() * 4)];
        }
        else if (lowerField.includes('stock') || lowerField.includes('quantity') || lowerField.includes('qty')) {
          (item as any)[field] = Math.floor(Math.random() * 1000);
        }
        else if (lowerField.includes('rating') || lowerField.includes('score')) {
          (item as any)[field] = (Math.random() * 5).toFixed(1);
        }
        else if (lowerField.includes('view') || lowerField.includes('like') || lowerField.includes('count') || lowerField.includes('follower')) {
          (item as any)[field] = Math.floor(Math.random() * 10000);
        }
        else if (lowerField.includes('description') || lowerField.includes('content') || lowerField.includes('bio') || lowerField.includes('about')) {
          (item as any)[field] = generateText();
        }
        else if (lowerField.includes('title') || lowerField.includes('heading')) {
          (item as any)[field] = generateTitle();
        }
        else if (lowerField.includes('sku') || lowerField.includes('code')) {
          (item as any)[field] = `SKU${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        }
        else if (lowerField.includes('id') && lowerField !== 'id') {
          (item as any)[field] = Math.floor(Math.random() * 9999) + 1;
        }
        else if (lowerField.includes('url') || lowerField.includes('website') || lowerField.includes('link')) {
          (item as any)[field] = `https://example-${i + 1}.com`;
        }
        else if (lowerField.includes('image') || lowerField.includes('photo') || lowerField.includes('avatar') || lowerField.includes('picture')) {
          (item as any)[field] = `https://via.placeholder.com/150?text=Image${i + 1}`;
        }
        else if (lowerField.includes('company') || lowerField.includes('organization')) {
          (item as any)[field] = generateCompany();
        }
        else if (lowerField.includes('job') || lowerField.includes('position') || lowerField.includes('role') || lowerField.includes('title')) {
          (item as any)[field] = generateJobTitle();
        }
        else if (lowerField.includes('gender') || lowerField.includes('sex')) {
          (item as any)[field] = ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)];
        }
        else {
          (item as any)[field] = `${field}_value_${i + 1}`;
        }
      });
      
      return item;
    });
  };

  const firstNames: string[] = ['James', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'David', 'Ava', 'John', 'Isabella', 'Robert', 'Mia', 'Daniel', 'Charlotte', 'Joseph', 'Amelia'];
  const lastNames: string[] = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
  
  const generateFirstName = (): string => firstNames[Math.floor(Math.random() * firstNames.length)];
  const generateLastName = (): string => lastNames[Math.floor(Math.random() * lastNames.length)];
  
  const generateEmail = (): string => {
    const first = generateFirstName().toLowerCase();
    const last = generateLastName().toLowerCase();
    const domains: string[] = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'mail.com'];
    return `${first}.${last}${Math.floor(Math.random() * 999)}@${domains[Math.floor(Math.random() * domains.length)]}`;
  };
  
  const generatePassword = (): string => {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from({ length: 12 }, (_: unknown): string => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  
  const generateUsername = (): string => {
    const first = generateFirstName().toLowerCase();
    const num: number = Math.floor(Math.random() * 9999);
    return `${first}${num}`;
  };
  
  const generatePhone = (): string => `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
  
  const generateAddress = (): string => {
    const num: number = Math.floor(Math.random() * 9999) + 1;
    const streets: string[] = ['Main St', 'Oak Ave', 'Maple Dr', 'Park Rd', 'Cedar Ln', 'Elm St', 'Washington Blvd', '1st Ave'];
    return `${num} ${streets[Math.floor(Math.random() * streets.length)]}`;
  };
  
  const cities: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'];
  const generateCity = (): string => cities[Math.floor(Math.random() * cities.length)];
  
  const states: string[] = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  const generateState = (): string => states[Math.floor(Math.random() * states.length)];
  
  const countries: string[] = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'Brazil'];
  const generateCountry = (): string => countries[Math.floor(Math.random() * countries.length)];
  
  const generateZip = (): string => String(Math.floor(Math.random() * 90000) + 10000);
  
  const generateText = (): string => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  
  const titles: string[] = ['Getting Started Guide', 'Best Practices', 'Complete Tutorial', 'Advanced Tips', 'Introduction to', 'Mastering the Art', 'Essential Guide'];
  const generateTitle = (): string => `${titles[Math.floor(Math.random() * titles.length)]} ${Math.floor(Math.random() * 100)}`;
  
  const companies: string[] = ['Tech Corp', 'Global Solutions', 'Digital Systems', 'Smart Industries', 'Innovation Labs', 'Future Enterprises'];
  const generateCompany = (): string => companies[Math.floor(Math.random() * companies.length)];
  
  const jobs: string[] = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Marketing Specialist', 'Sales Representative', 'HR Manager', 'Designer'];
  const generateJobTitle = (): string => jobs[Math.floor(Math.random() * jobs.length)];

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

  const formatIcons = {
    json: FileJson,
    csv: Database,
    sql: Code2
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Data Generator</h1>
          <p className="text-gray-600">Describe what you need and get instant test data in JSON, CSV, or SQL format</p>
        </div>

        {/* Main Input Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your data structure
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setUserPrompt(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>): void => { if (e.key === 'Enter') generateDataFromPrompt(); }}
                  placeholder="user with email password firstname lastname"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={generateDataFromPrompt}
                  disabled={!userPrompt || isGenerating}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
            <div className="mb-5">
              <div className="text-xs text-gray-500 mb-2">Try these:</div>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.slice(0, 3).map((prompt: ExamplePrompt, i: number) => (
                  <button
                    key={i}
                    onClick={(): void => setUserPrompt(prompt.text)}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Format and Count Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['json', 'csv', 'sql'] as const).map((fmt: string) => {
                    const Icon = formatIcons[fmt as keyof typeof formatIcons];
                    return (
                      <button
                        key={fmt}
                        onClick={(): void => setFormat(fmt)}
                        className={`px-3 py-2 rounded-md border transition-colors flex items-center justify-center gap-2 ${
                          format === fmt
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-sm font-medium uppercase">{fmt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of records: <span className="font-semibold">{count}</span>
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
            </div>
          </div>
        </div>

        {/* Generated Data Output */}
        {generatedData && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Generated Data</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadFile}
                  className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-900 rounded-md p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono">{generatedData}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Supported Field Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-blue-800">
            <div>
              <div className="font-medium mb-1">Identity</div>
              <div className="text-xs text-blue-700">email, password, username, firstname, lastname</div>
            </div>
            <div>
              <div className="font-medium mb-1">Contact</div>
              <div className="text-xs text-blue-700">phone, address, city, state, country, zip</div>
            </div>
            <div>
              <div className="font-medium mb-1">Financial</div>
              <div className="text-xs text-blue-700">price, amount, salary, currency, total</div>
            </div>
            <div>
              <div className="font-medium mb-1">Content</div>
              <div className="text-xs text-blue-700">title, description, content, bio, status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeDataGenerator;