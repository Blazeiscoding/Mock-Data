/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Download, Copy, Send, Loader2, Sparkles } from 'lucide-react';

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

    // Split by common delimiters
    const fields = cleaned.split(/[\s,]+(?:and\s+)?/)
      .filter((f: string) => f && f.length > 1)
      .filter((f: string) => !['with', 'and', 'or', 'the', 'a', 'an'].includes(f));

    // Remove the first word if it's a data type descriptor
    const dataTypeWords = ['user', 'users', 'product', 'products', 'order', 'orders', 'employee', 'employees', 'post', 'posts', 'item', 'items', 'record', 'records'];
    if (fields.length > 0 && dataTypeWords.includes(fields[0])) {
      fields.shift();
    }

    return fields.map((f: string): string => {
      // Convert to camelCase or keep as is
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
        
        // Email
        if (lowerField.includes('email') || lowerField === 'mail') {
          (item as any)[field] = generateEmail();
        }
        // Password
        else if (lowerField.includes('password') || lowerField === 'pwd' || lowerField === 'pass') {
          (item as any)[field] = generatePassword();
        }
        // First name
        else if (lowerField.includes('first') || lowerField === 'firstname' || lowerField === 'fname') {
          (item as any)[field] = generateFirstName();
        }
        // Last name
        else if (lowerField.includes('last') || lowerField === 'lastname' || lowerField === 'lname' || lowerField === 'surname') {
          (item as any)[field] = generateLastName();
        }
        // Full name
        else if (lowerField === 'name' || lowerField === 'fullname') {
          (item as any)[field] = `${generateFirstName()} ${generateLastName()}`;
        }
        // Username
        else if (lowerField.includes('user') && !lowerField.includes('id')) {
          (item as any)[field] = generateUsername();
        }
        // Age
        else if (lowerField.includes('age')) {
          (item as any)[field] = Math.floor(Math.random() * 50) + 18;
        }
        // Phone
        else if (lowerField.includes('phone') || lowerField.includes('mobile') || lowerField.includes('tel')) {
          (item as any)[field] = generatePhone();
        }
        // Address
        else if (lowerField.includes('address') || lowerField.includes('street')) {
          (item as any)[field] = generateAddress();
        }
        // City
        else if (lowerField.includes('city')) {
          (item as any)[field] = generateCity();
        }
        // State
        else if (lowerField.includes('state') || lowerField.includes('province')) {
          (item as any)[field] = generateState();
        }
        // Country
        else if (lowerField.includes('country') || lowerField.includes('nation')) {
          (item as any)[field] = generateCountry();
        }
        // Zip/Postal
        else if (lowerField.includes('zip') || lowerField.includes('postal')) {
          (item as any)[field] = generateZip();
        }
        // Price/Amount/Cost
        else if (lowerField.includes('price') || lowerField.includes('cost') || lowerField.includes('amount') || lowerField.includes('total') || lowerField.includes('salary')) {
          (item as any)[field] = (Math.random() * 1000 + 10).toFixed(2);
        }
        // Currency
        else if (lowerField.includes('currency')) {
          (item as any)[field] = ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)];
        }
        // Date/Time
        else if (lowerField.includes('date') || lowerField.includes('time') || lowerField.includes('created') || lowerField.includes('updated')) {
          (item as any)[field] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
        }
        // Status
        else if (lowerField.includes('status')) {
          (item as any)[field] = ['active', 'inactive', 'pending', 'completed', 'cancelled'][Math.floor(Math.random() * 5)];
        }
        // Boolean fields
        else if (lowerField.includes('is') || lowerField.includes('has') || lowerField.includes('verified') || lowerField.includes('active')) {
          (item as any)[field] = Math.random() > 0.5;
        }
        // Category/Type
        else if (lowerField.includes('category') || lowerField.includes('type') || lowerField.includes('department')) {
          (item as any)[field] = ['Type A', 'Type B', 'Type C', 'Type D'][Math.floor(Math.random() * 4)];
        }
        // Stock/Quantity
        else if (lowerField.includes('stock') || lowerField.includes('quantity') || lowerField.includes('qty')) {
          (item as any)[field] = Math.floor(Math.random() * 1000);
        }
        // Rating
        else if (lowerField.includes('rating') || lowerField.includes('score')) {
          (item as any)[field] = (Math.random() * 5).toFixed(1);
        }
        // Views/Likes/Count
        else if (lowerField.includes('view') || lowerField.includes('like') || lowerField.includes('count') || lowerField.includes('follower')) {
          (item as any)[field] = Math.floor(Math.random() * 10000);
        }
        // Description/Content/Bio
        else if (lowerField.includes('description') || lowerField.includes('content') || lowerField.includes('bio') || lowerField.includes('about')) {
          (item as any)[field] = generateText();
        }
        // Title
        else if (lowerField.includes('title') || lowerField.includes('heading')) {
          (item as any)[field] = generateTitle();
        }
        // SKU/Code
        else if (lowerField.includes('sku') || lowerField.includes('code')) {
          (item as any)[field] = `SKU${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        }
        // ID fields (except the main id)
        else if (lowerField.includes('id') && lowerField !== 'id') {
          (item as any)[field] = Math.floor(Math.random() * 9999) + 1;
        }
        // URL/Website
        else if (lowerField.includes('url') || lowerField.includes('website') || lowerField.includes('link')) {
          (item as any)[field] = `https://example-${i + 1}.com`;
        }
        // Image
        else if (lowerField.includes('image') || lowerField.includes('photo') || lowerField.includes('avatar') || lowerField.includes('picture')) {
          (item as any)[field] = `https://via.placeholder.com/150?text=Image${i + 1}`;
        }
        // Company
        else if (lowerField.includes('company') || lowerField.includes('organization')) {
          (item as any)[field] = generateCompany();
        }
        // Job/Position/Role
        else if (lowerField.includes('job') || lowerField.includes('position') || lowerField.includes('role') || lowerField.includes('title')) {
          (item as any)[field] = generateJobTitle();
        }
        // Gender
        else if (lowerField.includes('gender') || lowerField.includes('sex')) {
          (item as any)[field] = ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)];
        }
        // Default: string value
        else {
          (item as any)[field] = `${field}_value_${i + 1}`;
        }
      });
      
      return item;
    });
  };

  // Generator functions with proper return types
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

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-violet-600" size={32} />
            <h1 className="text-4xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Data Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Describe the fields you need, and get instant mock data</p>
          <p className="text-sm text-gray-500 mt-1">Just type: "user with email password firstname lastname"</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What fields do you need? ✨
          </label>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={userPrompt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setUserPrompt(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>): void => { if (e.key === 'Enter') generateDataFromPrompt(); }}
              placeholder="e.g., user with email password firstname lastname"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none text-gray-700"
            />
            <button
              onClick={generateDataFromPrompt}
              disabled={!userPrompt || isGenerating}
              className="bg-linear-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Generate
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {examplePrompts.slice(0, 3).map((prompt: ExamplePrompt, i: number) => (
              <button
                key={i}
                onClick={(): void => setUserPrompt(prompt.text)}
                className="text-xs px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full hover:bg-violet-100 transition-colors border border-violet-200"
              >
                {prompt.text}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex gap-2">
                {['json', 'csv', 'sql'].map((fmt: string) => (
                  <button
                    key={fmt}
                    onClick={(): void => setFormat(fmt)}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-medium uppercase text-sm ${
                      format === fmt
                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Records: {count}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={count}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          </div>
        </div>

        {generatedData && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Data</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadFile}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-96">
              <pre className="text-green-400 text-sm font-mono">{generatedData}</pre>
            </div>
          </div>
        )}

        <div className="mt-6 bg-linear-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Supported Fields</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
            <div>• email, password</div>
            <div>• firstname, lastname</div>
            <div>• username, name</div>
            <div>• age, phone</div>
            <div>• address, city, country</div>
            <div>• price, amount, salary</div>
            <div>• date, timestamp</div>
            <div>• status, category</div>
            <div>• title, description</div>
            <div>• stock, quantity</div>
            <div>• rating, views, likes</div>
            <div>• company, position</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeDataGenerator;