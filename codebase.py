from pathlib import Path
import os


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_FILE = PROJECT_ROOT / "codebase.md"

MAX_FILE_SIZE_MB = 2
MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024


# ============================================================
# FOLDERS TO COMPLETELY IGNORE
# ============================================================
#
# These folders are not scanned at all.
# Add project-specific large/unnecessary folders here.
#

SKIP_DIRS = {
    ".git",
    ".svn",
    ".hg",

    "node_modules",

    ".venv",
    "venv",
    "env",

    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",

    ".next",
    "dist",
    "build",
    "out",
    "coverage",

    ".cache",
    ".turbo",
    ".parcel-cache",

    ".vscode",
    ".idea",

    "logs",
    "tmp",
    "temp",

    "uploads",
    "generated",

    "tests",
    "llm",
    "docs",
    "media_fmp4_backup"
}


# ============================================================
# FOLDER PREFIXES TO IGNORE
# ============================================================

SKIP_DIR_PREFIXES = {
    ".venv",
}


# ============================================================
# FOLDERS TO SHOW IN TREE BUT NOT EXPAND
# ============================================================
#
# Example:
#
#     ├── datasets
#
# The folder is visible, but its internal structure is hidden.
#

COLLAPSE_TREE_DIRS = {
    "dataset_train",
    "datasets",
    "dataset",
    "data",

    "assets",
    "asset",

    "public",
    "static",
    "media",

    "cache",
}


# ============================================================
# FILES TO EXCLUDE FROM CODE CONTENT
# ============================================================

SKIP_FILES = {
    "backend\data\sign_media.json",
    "frontend\src\app\about\page.tsx",
    "codebase.py",
    "IMPLEMENTATION_GUIDE.md",
    "README.md",
    "codebase.md",
    "project-tree.txt",
    "implementation.md"
    "frontend\package-lock.json",
    # Dependency locks
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lock",

    # Generated
    "tsconfig.tsbuildinfo",
    "next-env.d.ts",

    # OS
    ".DS_Store",
    "Thumbs.db",

    # Logs
    "debug.log",
    "error.log",
    "server.log",
    "server-out.log",

    # Secrets
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",

    # Credentials
    "credentials.json",
    "service-account.json",
    "secrets.json",

    # Optional AI instructions
    "AGENTS.md",
    "CLAUDE.md",
}


# ============================================================
# FILE EXTENSIONS TO EXCLUDE
# ============================================================

SKIP_EXTENSIONS = {
    # Images
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".bmp",
    ".tiff",
    ".ico",
    ".svg",

    # Audio
    ".mp3",
    ".wav",
    ".flac",
    ".ogg",
    ".m4a",

    # Video
    ".mp4",
    ".webm",
    ".avi",
    ".mov",
    ".mkv",

    # Documents
    ".pdf",

    # Archives
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",

    # Data
    ".csv",
    ".xlsx",
    ".xls",
    ".parquet",
    ".feather",

    # Databases
    ".db",
    ".sqlite",
    ".sqlite3",

    # ML models
    ".onnx",
    ".pt",
    ".pth",
    ".ckpt",
    ".safetensors",
    ".gguf",
    ".bin",

    # Compiled Python
    ".pyc",
    ".pyo",

    # Temporary
    ".bak",
    ".tmp",

    # Fonts
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",

    # Certificates / keys
    ".pem",
    ".key",
    ".p12",
    ".pfx",
    ".jks",
    ".crt",
    ".cert",
}


# ============================================================
# SOURCE FILE EXTENSIONS
# ============================================================

INCLUDE_EXTENSIONS = {
    # Python
    ".py",
    ".pyi",

    # JavaScript / TypeScript
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",

    # Web
    ".html",
    ".css",
    ".scss",
    ".sass",

    # Config
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".conf",

    # Shell
    ".sh",
    ".bat",
    ".cmd",
    ".ps1",

    # Documentation
    ".md",
    ".txt",
}


# ============================================================
# LANGUAGE MAP
# ============================================================

LANGUAGE_MAP = {
    ".py": "python",
    ".pyi": "python",

    ".js": "javascript",
    ".jsx": "jsx",
    ".mjs": "javascript",
    ".cjs": "javascript",

    ".ts": "typescript",
    ".tsx": "tsx",

    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",

    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".conf": "text",

    ".sh": "bash",
    ".bat": "bat",
    ".cmd": "bat",
    ".ps1": "powershell",

    ".md": "markdown",
    ".txt": "text",
}


# ============================================================
# HELPERS
# ============================================================

def rel(path):
    return path.relative_to(PROJECT_ROOT)


def is_skip_dir(name):
    name_lower = name.lower()

    if name_lower in {
        x.lower()
        for x in SKIP_DIRS
    }:
        return True

    for prefix in SKIP_DIR_PREFIXES:
        if name_lower.startswith(prefix.lower()):
            return True

    return False


def is_secret(path):

    if path.name.lower() in {
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
    }:
        return True

    if path.suffix.lower() in {
        ".pem",
        ".key",
        ".p12",
        ".pfx",
        ".jks",
    }:
        return True

    return False


# ============================================================
# SCAN SOURCE FILES
# ============================================================

def scan_project():

    files = []

    for current_dir, dirs, filenames in os.walk(
        PROJECT_ROOT
    ):

        current_path = Path(current_dir)

        # ----------------------------------------------------
        # PRUNE DIRECTORIES
        # ----------------------------------------------------

        dirs[:] = [
            d
            for d in dirs
            if not d.startswith(".")
            and not is_skip_dir(d)
        ]

        # ----------------------------------------------------
        # FILES
        # ----------------------------------------------------

        for filename in filenames:

            path = current_path / filename

            # Hidden files
            if filename.startswith("."):
                continue

            # Generated output
            if path.resolve() == OUTPUT_FILE.resolve():
                continue

            # Explicit file skip
            if filename in SKIP_FILES:
                continue

            # Secrets
            if is_secret(path):
                continue

            extension = path.suffix.lower()

            # Binary / data / model
            if extension in SKIP_EXTENSIONS:
                continue

            # Not a source/config file
            if extension not in INCLUDE_EXTENSIONS:
                continue

            # File size
            try:
                size = path.stat().st_size
            except OSError:
                continue

            if size > MAX_FILE_SIZE:
                continue

            files.append(path)

    return sorted(
        files,
        key=lambda p: str(rel(p)).lower()
    )


# ============================================================
# BUILD COMPACT PROJECT TREE
# ============================================================

def build_tree():

    lines = [PROJECT_ROOT.name]

    collapsed = {
        x.lower()
        for x in COLLAPSE_TREE_DIRS
    }

    def walk(directory, prefix=""):

        try:
            items = list(directory.iterdir())
        except (PermissionError, OSError):
            return

        visible = []

        for item in items:

            # Hide dot files/folders
            if item.name.startswith("."):
                continue

            # Completely ignored directory
            if item.is_dir() and is_skip_dir(item.name):
                continue

            visible.append(item)

        # Directories first, then files
        visible.sort(
            key=lambda x: (
                x.is_file(),
                x.name.lower()
            )
        )

        for index, item in enumerate(visible):

            last = index == len(visible) - 1

            connector = (
                "└── "
                if last
                else "├── "
            )

            lines.append(
                prefix + connector + item.name
            )

            # File
            if not item.is_dir():
                continue

            # Show folder but don't expand it
            if item.name.lower() in collapsed:
                continue

            next_prefix = (
                prefix
                + ("    " if last else "│   ")
            )

            walk(
                item,
                next_prefix
            )

    walk(PROJECT_ROOT)

    return lines


# ============================================================
# READ FILE
# ============================================================

def read_text(path):

    try:
        return path.read_text(
            encoding="utf-8",
            errors="replace"
        )
    except Exception:
        return ""


# ============================================================
# LANGUAGE
# ============================================================

def language_for(path):

    return LANGUAGE_MAP.get(
        path.suffix.lower(),
        "text"
    )


# ============================================================
# WRITE SOURCE FILE
# ============================================================

def write_file(md, path):

    text = read_text(path)

    md.write(
        f"# FILE: `{rel(path)}`\n\n"
    )

    md.write(
        f"```{language_for(path)}\n"
    )

    md.write(text)

    if not text.endswith("\n"):
        md.write("\n")

    md.write(
        "```\n\n"
        "---\n\n"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("Scanning project...")

    included_files = scan_project()

    print(
        f"Found {len(included_files)} source files."
    )

    print("Building project tree...")

    tree = build_tree()

    print("Writing codebase.md...")

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8"
    ) as md:

        # ----------------------------------------------------
        # HEADER
        # ----------------------------------------------------

        md.write(
            f"# {PROJECT_ROOT.name} — AI Codebase Context\n\n"
        )

        md.write(
            "> Compact project architecture followed by "
            "relevant source and configuration files.\n\n"
        )

        md.write(
            f"**Included files:** `{len(included_files)}`  \n"
        )

        md.write(
            f"**Maximum source file size:** "
            f"`{MAX_FILE_SIZE_MB} MB`\n\n"
        )

        md.write(
            "---\n\n"
        )

        # ----------------------------------------------------
        # PROJECT TREE
        # ----------------------------------------------------

        md.write(
            "# Project Structure\n\n"
        )

        md.write(
            "```text\n"
        )

        md.write(
            "\n".join(tree)
        )

        md.write(
            "\n```\n\n"
        )

        md.write(
            "---\n\n"
        )

        # ----------------------------------------------------
        # INCLUDED FILES
        # ----------------------------------------------------

        md.write(
            "# Included Files\n\n"
        )

        for path in included_files:

            md.write(
                f"- `{rel(path)}`\n"
            )

        md.write(
            "\n---\n\n"
        )

        # ----------------------------------------------------
        # SOURCE FILES
        # ----------------------------------------------------

        md.write(
            "# Source Files\n\n"
        )

        for index, path in enumerate(
            included_files,
            start=1
        ):

            print(
                f"  [{index}/{len(included_files)}] "
                f"{rel(path)}"
            )

            write_file(
                md,
                path
            )

    print()
    print("=" * 60)
    print("CODEBASE CREATED")
    print("=" * 60)
    print(f"Output         : {OUTPUT_FILE}")
    print(f"Included files : {len(included_files)}")
    print("=" * 60)


if __name__ == "__main__":
    main()