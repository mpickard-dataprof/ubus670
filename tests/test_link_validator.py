import unittest
from pathlib import Path
import sys

# Add the parent directory to sys.path so we can import from _tools
sys.path.append(str(Path(__file__).resolve().parent.parent / "Materials" / "_tools"))

# We will implement this class in _tools/validate_links.py
try:
    from validate_links import LinkValidator
except ImportError:
    # This is expected before we implement the tool
    LinkValidator = None

class TestLinkValidator(unittest.TestCase):
    def setUp(self):
        if LinkValidator is None:
            self.skipTest("LinkValidator not yet implemented")
        self.validator = LinkValidator()

    def test_is_absolute_path_true(self):
        # Local absolute paths
        self.assertTrue(self.validator.is_absolute("/home/user/file.css"))
        self.assertTrue(self.validator.is_absolute(r"C:\Users\file.css"))
        self.assertTrue(self.validator.is_absolute("/absolute/root/path.js"))
        # Localhost
        self.assertTrue(self.validator.is_absolute("http://localhost:3000/style.css"))

    def test_is_absolute_path_false(self):
        # Relative paths
        self.assertFalse(self.validator.is_absolute("style.css"))
        self.assertFalse(self.validator.is_absolute("./style.css"))
        self.assertFalse(self.validator.is_absolute("../style.css"))
        self.assertFalse(self.validator.is_absolute("../../_shared/styles.css"))
        # External URLs (allowed)
        self.assertFalse(self.validator.is_absolute("https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reset.min.css"))
        self.assertFalse(self.validator.is_absolute("https://fonts.googleapis.com/css2?family=Montserrat"))
        # Protocol-relative URLs (allowed)
        self.assertFalse(self.validator.is_absolute("//cdn.example.com/file.js"))

    def test_check_html_content_finds_absolute(self):
        html = r"""
        <html>
        <head>
            <link rel="stylesheet" href="../../_shared/styles.css">
            <link rel="stylesheet" href="/absolute/path.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.js"></script>
        </head>
        <body>
            <img src="C:\Users\Images\logo.png">
            <a href="http://localhost:8000/page.html">Local Link</a>
            <a href="lecture.html">Next Page</a>
        </body>
        </html>
        """
        errors = self.validator.get_absolute_paths_in_html(html)
        self.assertEqual(len(errors), 3)
        self.assertIn("/absolute/path.css", errors)
        self.assertIn(r"C:\Users\Images\logo.png", errors)
        self.assertIn("http://localhost:8000/page.html", errors)

if __name__ == "__main__":
    unittest.main()
