#!/usr/bin/env python3
"""
Next.js Translation Key Analyzer
Finds translation keys used in t() calls and checks against locale file
"""

import os
import json
import re
from pathlib import Path
from typing import Set, Dict, List

class NextJSTranslationAnalyzer:
    def __init__(self, src_path="src", locale_path="src/locales/en.json"):
        self.src_path = Path(src_path)
        self.locale_path = Path(locale_path)
        
        # Only match t() function calls with word boundaries
        self.t_function_pattern = r'\bt\s*\(\s*[\'"`]([^\'"`,]+)[\'"`]\s*\)'
        
        # File extensions to analyze
        self.extensions = {'.js', '.jsx', '.ts', '.tsx'}
        
    def find_translation_keys_in_file(self, file_path: Path) -> Set[str]:
        """Extract t() translation keys from a single file"""
        keys = set()
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                
                # Find all t() function calls
                matches = re.findall(self.t_function_pattern, content)
                keys.update(matches)
                
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            
        return keys
    
    def scan_source_files(self) -> Dict[str, Set[str]]:
        """Scan all source files and collect translation keys"""
        file_keys = {}
        all_keys = set()
        
        print(f"🔍 Scanning {self.src_path} for t() calls...")
        
        for file_path in self.src_path.rglob("*"):
            if file_path.suffix in self.extensions:
                keys = self.find_translation_keys_in_file(file_path)
                if keys:
                    relative_path = file_path.relative_to(self.src_path)
                    file_keys[str(relative_path)] = keys
                    all_keys.update(keys)
                    print(f"   📄 {relative_path}: {len(keys)} keys")
        
        return file_keys, all_keys
    
    def load_locale_file(self) -> Dict[str, any]:
        """Load and flatten the locale JSON file"""
        try:
            with open(self.locale_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                return self.flatten_json(data)
        except FileNotFoundError:
            print(f"❌ Locale file not found: {self.locale_path}")
            return {}
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in locale file: {e}")
            return {}
    
    def flatten_json(self, obj, parent_key='', sep='.'):
        """Flatten nested JSON with dot notation"""
        items = []
        for key, value in obj.items():
            new_key = f"{parent_key}{sep}{key}" if parent_key else key
            if isinstance(value, dict):
                items.extend(self.flatten_json(value, new_key, sep=sep).items())
            else:
                items.append((new_key, value))
        return dict(items)
    
    def create_missing_json(self, missing_keys: Set[str]) -> Dict:
        """Create nested JSON structure for missing keys"""
        result = {}
        
        for key in sorted(missing_keys):
            parts = key.split('.')
            current = result
            
            for i, part in enumerate(parts):
                if i == len(parts) - 1:
                    current[part] = ""
                else:
                    if part not in current:
                        current[part] = {}
                    current = current[part]
        
        return result
    
    def analyze(self):
        """Main analysis function"""
        print("🚀 Next.js Translation Analyzer")
        print("=" * 50)
        
        # Scan source files
        file_keys, all_found_keys = self.scan_source_files()
        
        # Load existing translations
        print(f"\n📚 Loading translations from {self.locale_path}")
        existing_translations = self.load_locale_file()
        existing_keys = set(existing_translations.keys())
        
        # Find missing keys
        missing_keys = all_found_keys - existing_keys
        unused_keys = existing_keys - all_found_keys
        
        # Print results
        self.print_results(all_found_keys, existing_keys, missing_keys, unused_keys, file_keys)
        
        # Save missing keys if any
        if missing_keys:
            self.save_missing_keys(missing_keys)
            
        return {
            'found_keys': all_found_keys,
            'missing_keys': missing_keys,
            'unused_keys': unused_keys,
            'file_keys': file_keys
        }
    
    def print_results(self, found_keys, existing_keys, missing_keys, unused_keys, file_keys):
        """Print analysis results"""
        print(f"\n📊 RESULTS")
        print("=" * 50)
        print(f"Translation keys in code: {len(found_keys)}")
        print(f"Translation keys in locale: {len(existing_keys)}")
        print(f"Missing translations: {len(missing_keys)}")
        print(f"Unused translations: {len(unused_keys)}")
        
        if missing_keys:
            print(f"\n❌ MISSING TRANSLATIONS ({len(missing_keys)}):")
            for key in sorted(missing_keys):
                # Find which files use this key
                files_using_key = [f for f, keys in file_keys.items() if key in keys]
                print(f"   • {key}")
                for file in files_using_key[:2]:  # Show first 2 files
                    print(f"     └─ used in: {file}")
                if len(files_using_key) > 2:
                    print(f"     └─ ... and {len(files_using_key) - 2} more files")
        else:
            print(f"\n✅ All translation keys found in locale file!")
        
        if unused_keys and len(unused_keys) <= 10:
            print(f"\n⚠️  UNUSED TRANSLATIONS ({len(unused_keys)}):")
            for key in sorted(unused_keys):
                print(f"   • {key}")
        elif unused_keys:
            print(f"\n⚠️  UNUSED TRANSLATIONS ({len(unused_keys)}) - showing first 10:")
            for key in sorted(list(unused_keys)[:10]):
                print(f"   • {key}")
            print(f"   ... and {len(unused_keys) - 10} more")
    
    def save_missing_keys(self, missing_keys):
        """Save missing keys to JSON file"""
        missing_json = self.create_missing_json(missing_keys)
        output_file = "missing_translations.json"
        
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(missing_json, file, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Missing keys saved to: {output_file}")
        print("Copy these to your locale file and add translations!")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Analyze Next.js translation keys')
    parser.add_argument('--src', default='src', help='Source folder (default: src)')
    parser.add_argument('--locale', default='src/locales/en.json', help='Locale file (default: src/locales/en.json)')
    
    args = parser.parse_args()
    
    analyzer = NextJSTranslationAnalyzer(args.src, args.locale)
    analyzer.analyze()

if __name__ == "__main__":
    main()