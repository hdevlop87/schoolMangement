#!/usr/bin/env python3
"""
Locale Files Comparison Tool
Compares en.json (reference) with other language files to find missing translations
"""

import os
import json
from pathlib import Path
from typing import Dict, Set, List
import argparse

class LocaleComparator:
    def __init__(self, locales_dir="src/locales", reference_lang="en"):
        self.locales_dir = Path(locales_dir)
        self.reference_lang = reference_lang
        self.reference_file = self.locales_dir / f"{reference_lang}.json"
        
    def flatten_json(self, obj, parent_key='', sep='.'):
        """Flatten nested JSON with dot notation"""
        items = []
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_key = f"{parent_key}{sep}{key}" if parent_key else key
                if isinstance(value, dict):
                    items.extend(self.flatten_json(value, new_key, sep=sep).items())
                else:
                    items.append((new_key, value))
        return dict(items)
    
    def unflatten_json(self, flat_dict):
        """Convert flattened dict back to nested structure"""
        result = {}
        for key, value in flat_dict.items():
            parts = key.split('.')
            current = result
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            current[parts[-1]] = value
        return result
    
    def load_locale_file(self, file_path: Path) -> Dict:
        """Load and flatten a locale file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                return self.flatten_json(data)
        except FileNotFoundError:
            print(f"❌ File not found: {file_path}")
            return {}
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in {file_path}: {e}")
            return {}
        except Exception as e:
            print(f"❌ Error loading {file_path}: {e}")
            return {}
    
    def find_locale_files(self) -> List[Path]:
        """Find all .json files in locales directory"""
        if not self.locales_dir.exists():
            print(f"❌ Locales directory not found: {self.locales_dir}")
            return []
        
        json_files = []
        for file_path in self.locales_dir.glob("*.json"):
            json_files.append(file_path)
        
        return sorted(json_files)
    
    def compare_locales(self):
        """Main comparison function"""
        print("🌍 Locale Files Comparison Tool")
        print("=" * 50)
        
        # Load reference file
        print(f"📚 Loading reference file: {self.reference_file.name}")
        if not self.reference_file.exists():
            print(f"❌ Reference file not found: {self.reference_file}")
            return
        
        reference_data = self.load_locale_file(self.reference_file)
        if not reference_data:
            print("❌ Could not load reference file")
            return
        
        reference_keys = set(reference_data.keys())
        print(f"   Found {len(reference_keys)} keys in {self.reference_lang}.json")
        
        # Find and compare other locale files
        locale_files = self.find_locale_files()
        other_files = [f for f in locale_files if f.name != f"{self.reference_lang}.json"]
        
        if not other_files:
            print(f"❌ No other locale files found in {self.locales_dir}")
            return
        
        print(f"\n🔍 Found {len(other_files)} other locale files:")
        for file in other_files:
            print(f"   • {file.name}")
        
        # Compare each locale file
        comparison_results = {}
        
        for locale_file in other_files:
            lang_code = locale_file.stem
            print(f"\n🔄 Comparing {lang_code}.json...")
            
            locale_data = self.load_locale_file(locale_file)
            locale_keys = set(locale_data.keys())
            
            missing_keys = reference_keys - locale_keys
            extra_keys = locale_keys - reference_keys
            
            comparison_results[lang_code] = {
                'file_path': locale_file,
                'total_keys': len(locale_keys),
                'missing_keys': missing_keys,
                'extra_keys': extra_keys,
                'coverage': len(locale_keys) / len(reference_keys) * 100 if reference_keys else 0
            }
            
            print(f"   📊 {len(locale_keys)}/{len(reference_keys)} keys ({comparison_results[lang_code]['coverage']:.1f}% coverage)")
            print(f"   ❌ Missing: {len(missing_keys)} keys")
            print(f"   ➕ Extra: {len(extra_keys)} keys")
        
        # Print detailed results
        self.print_detailed_results(comparison_results, reference_data)
        
        # Generate missing translation files
        self.generate_missing_files(comparison_results, reference_data)
        
        return comparison_results
    
    def print_detailed_results(self, results: Dict, reference_data: Dict):
        """Print detailed comparison results"""
        print(f"\n📋 DETAILED RESULTS")
        print("=" * 50)
        
        for lang_code, data in results.items():
            print(f"\n🌐 {lang_code.upper()} ({data['file_path'].name})")
            print(f"Coverage: {data['coverage']:.1f}% ({data['total_keys']}/{len(reference_data)} keys)")
            
            if data['missing_keys']:
                missing_list = sorted(data['missing_keys'])
                print(f"\n❌ Missing translations ({len(missing_list)}):")
                
                # Show first 10 missing keys
                for key in missing_list[:10]:
                    ref_value = reference_data.get(key, '')
                    # Truncate long values
                    display_value = ref_value[:50] + "..." if len(str(ref_value)) > 50 else ref_value
                    print(f"   • {key}")
                    print(f"     EN: {display_value}")
                
                if len(missing_list) > 10:
                    print(f"   ... and {len(missing_list) - 10} more missing keys")
            else:
                print("✅ No missing translations!")
            
            if data['extra_keys'] and len(data['extra_keys']) <= 5:
                print(f"\n➕ Extra keys ({len(data['extra_keys'])}):")
                for key in sorted(data['extra_keys']):
                    print(f"   • {key}")
            elif data['extra_keys']:
                print(f"\n➕ {len(data['extra_keys'])} extra keys (not in reference)")
    
    def generate_missing_files(self, results: Dict, reference_data: Dict):
        """Generate JSON files with missing translations for each language"""
        print(f"\n💾 GENERATING MISSING TRANSLATION FILES")
        print("=" * 50)
        
        for lang_code, data in results.items():
            if not data['missing_keys']:
                print(f"✅ {lang_code}.json is complete - no missing file needed")
                continue
            
            # Create missing translations structure
            missing_translations = {}
            for key in data['missing_keys']:
                missing_translations[key] = reference_data[key]
            
            # Convert back to nested structure
            nested_missing = self.unflatten_json(missing_translations)
            
            # Save to file
            output_file = f"missing_{lang_code}.json"
            with open(output_file, 'w', encoding='utf-8') as file:
                json.dump(nested_missing, file, indent=2, ensure_ascii=False)
            
            print(f"📄 {output_file}: {len(data['missing_keys'])} missing keys")
        
        print(f"\n💡 Tip: Merge these files with your existing locale files")
    
    def create_summary_report(self, results: Dict):
        """Create a summary report"""
        print(f"\n📈 SUMMARY REPORT")
        print("=" * 50)
        
        total_languages = len(results)
        complete_languages = len([r for r in results.values() if len(r['missing_keys']) == 0])
        
        print(f"Total languages: {total_languages}")
        print(f"Complete languages: {complete_languages}")
        print(f"Languages needing work: {total_languages - complete_languages}")
        
        if results:
            avg_coverage = sum(r['coverage'] for r in results.values()) / len(results)
            print(f"Average coverage: {avg_coverage:.1f}%")
            
            # Best and worst coverage
            best_lang = max(results.keys(), key=lambda k: results[k]['coverage'])
            worst_lang = min(results.keys(), key=lambda k: results[k]['coverage'])
            
            print(f"Best coverage: {best_lang} ({results[best_lang]['coverage']:.1f}%)")
            print(f"Worst coverage: {worst_lang} ({results[worst_lang]['coverage']:.1f}%)")

def main():
    parser = argparse.ArgumentParser(description='Compare locale files and find missing translations')
    parser.add_argument('--locales-dir', default='src/locales', help='Locales directory (default: src/locales)')
    parser.add_argument('--reference', default='en', help='Reference language code (default: en)')
    parser.add_argument('--summary', action='store_true', help='Show summary report')
    
    args = parser.parse_args()
    
    comparator = LocaleComparator(args.locales_dir, args.reference)
    results = comparator.compare_locales()
    
    if results and args.summary:
        comparator.create_summary_report(results)

if __name__ == "__main__":
    main()