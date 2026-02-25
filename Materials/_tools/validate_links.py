#!/usr/bin/env python3
import re
from pathlib import Path

class LinkValidator:
    def __init__(self):
        # Patterns that indicate an absolute path that is NOT a common CDN or external site
        self.abs_path_patterns = [
            r'^/[^/]',         # Root-relative path (e.g., /style.css)
            r'^[A-Za-z]:\\',    # Windows absolute path
            r'^/home/',        # Linux absolute path
            r'^/Users/',       # macOS absolute path
            r'^http://localhost', # Localhost
        ]

    def is_absolute(self, path):
        """Returns True if the path is an absolute local path or localhost."""
        for pattern in self.abs_path_patterns:
            if re.search(pattern, path):
                return True
        return False

    def get_absolute_paths_in_html(self, html):
        """Extracts src and href attributes and returns those that are absolute."""
        # Find all src="..." and href="..."
        # Using a safer regex that handles both single and double quotes
        found_paths = []
        # Double quotes
        found_paths.extend(re.findall(r'(?:src|href)="([^"]*)"', html))
        # Single quotes
        found_paths.extend(re.findall(r"(?:src|href)='([^']*)'", html))
        return [path for path in found_paths if self.is_absolute(path)]

    def validate_file(self, file_path):
        """Validates a single HTML file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return self.get_absolute_paths_in_html(content)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return []

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Validate that HTML files use relative paths for GitHub Pages.")
    parser.add_argument("directory", help="Directory to scan for HTML files.")
    args = parser.parse_args()

    validator = LinkValidator()
    root_dir = Path(args.directory)
    
    total_errors = 0
    # Search in Materials directory specifically to avoid clutter
    for html_file in root_dir.glob("**/*.html"):
        # Skip hidden directories
        if any(part.startswith('.') for part in html_file.parts):
            continue
            
        errors = validator.validate_file(html_file)
        if errors:
            print(f"Error in {html_file}:")
            for err in errors:
                print(f"  - Absolute path found: {err}")
            total_errors += len(errors)

    if total_errors > 0:
        print(f"\nTotal errors found: {total_errors}")
        exit(1)
    else:
        print("All HTML files validated successfully (no absolute paths found).")
        exit(0)

if __name__ == "__main__":
    main()
