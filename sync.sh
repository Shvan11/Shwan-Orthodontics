#!/bin/bash

# Comprehensive sync script for Shwan Orthodontics project
# Handles bidirectional sync between Windows and WSL

WINDOWS_PATH="/mnt/c/shwan-orthodontics"
WSL_PATH="$HOME/projects/shwan-orthodontics"
BACKUP_DIR="$HOME/.backups/shwan-orthodontics"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

create_backup() {
    local source_path="$1"
    local backup_name="$2"
    
    if [ -d "$source_path" ]; then
        print_status "Creating backup: $backup_name"
        tar -czf "$BACKUP_DIR/${backup_name}_$(date +%Y%m%d_%H%M%S).tar.gz" -C "$(dirname "$source_path")" "$(basename "$source_path")" 2>/dev/null
        # Keep only last 5 backups
        ls -t "$BACKUP_DIR"/${backup_name}_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null
    fi
}

check_modifications() {
    local path="$1"
    local name="$2"
    
    if [ -d "$path" ]; then
        local mod_time=$(find "$path" -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.md" | grep -v node_modules | head -1 | xargs stat -c %Y 2>/dev/null || echo 0)
        echo "$mod_time"
    else
        echo "0"
    fi
}

sync_to_wsl() {
    print_status "Starting sync from Windows to WSL..."
    
    # Check if Windows directory exists
    if [ ! -d "$WINDOWS_PATH" ]; then
        print_error "Windows directory not found: $WINDOWS_PATH"
        exit 1
    fi
    
    # Create backup of WSL version
    create_backup "$WSL_PATH" "wsl_backup"
    
    # Create WSL directory if it doesn't exist
    mkdir -p "$WSL_PATH"
    
    # Sync source files (exclude problematic files/folders)
    print_status "Syncing source files..."
    rsync -av --delete \
          --exclude='node_modules/' \
          --exclude='.next/' \
          --exclude='dist/' \
          --exclude='build/' \
          --exclude='.git/' \
          --exclude='*.log' \
          --exclude='.DS_Store' \
          --exclude='Thumbs.db' \
          --exclude='package-lock.json' \
          "$WINDOWS_PATH/" "$WSL_PATH/"
    
    # Handle npm dependencies
    cd "$WSL_PATH"
    if [ -f "package.json" ]; then
        print_status "Installing/updating npm dependencies in WSL..."
        npm install --silent
    fi
    
    print_success "Sync from Windows to WSL completed!"
    print_warning "You can now work in: $WSL_PATH"
}

sync_to_windows() {
    print_status "Starting sync from WSL to Windows..."
    
    # Check if WSL directory exists
    if [ ! -d "$WSL_PATH" ]; then
        print_error "WSL directory not found: $WSL_PATH"
        print_error "Run './sync.sh to-wsl' first to set up WSL environment"
        exit 1
    fi
    
    # Create backup of Windows version
    create_backup "$WINDOWS_PATH" "windows_backup"
    
    # Create Windows directory if it doesn't exist
    mkdir -p "$WINDOWS_PATH"
    
    # Sync source files back (exclude WSL-specific files)
    print_status "Syncing source files..."
    rsync -av --delete \
          --exclude='node_modules/' \
          --exclude='.next/' \
          --exclude='dist/' \
          --exclude='build/' \
          --exclude='.git/' \
          --exclude='*.log' \
          --exclude='.DS_Store' \
          --exclude='Thumbs.db' \
          "$WSL_PATH/" "$WINDOWS_PATH/"
    
    print_success "Sync from WSL to Windows completed!"
    print_warning "Windows version updated at: $WINDOWS_PATH"
}

smart_sync() {
    print_status "Performing smart bidirectional sync..."
    
    # Check modification times
    local windows_mod=$(check_modifications "$WINDOWS_PATH" "windows")
    local wsl_mod=$(check_modifications "$WSL_PATH" "wsl")
    
    print_status "Windows last modified: $(date -d @$windows_mod 2>/dev/null || echo 'Unknown')"
    print_status "WSL last modified: $(date -d @$wsl_mod 2>/dev/null || echo 'Unknown')"
    
    if [ "$windows_mod" -gt "$wsl_mod" ]; then
        print_warning "Windows version is newer, syncing to WSL..."
        sync_to_wsl
    elif [ "$wsl_mod" -gt "$windows_mod" ]; then
        print_warning "WSL version is newer, syncing to Windows..."
        sync_to_windows
    else
        print_success "Both versions appear to be in sync!"
        if [ ! -d "$WSL_PATH/node_modules" ]; then
            print_status "WSL node_modules missing, setting up..."
            cd "$WSL_PATH" && npm install --silent
        fi
    fi
}

show_status() {
    print_status "=== Project Status ==="
    echo
    
    if [ -d "$WINDOWS_PATH" ]; then
        local win_files=$(find "$WINDOWS_PATH" -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l)
        print_status "Windows: ✓ ($win_files source files)"
        echo "  Path: $WINDOWS_PATH"
        echo "  Last modified: $(find "$WINDOWS_PATH" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | head -1 | xargs stat -c %y 2>/dev/null | cut -d. -f1 || echo 'Unknown')"
    else
        print_warning "Windows: ✗ (not found)"
    fi
    
    echo
    
    if [ -d "$WSL_PATH" ]; then
        local wsl_files=$(find "$WSL_PATH" -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l)
        local node_modules_status="✗"
        [ -d "$WSL_PATH/node_modules" ] && node_modules_status="✓"
        print_status "WSL: ✓ ($wsl_files source files, node_modules: $node_modules_status)"
        echo "  Path: $WSL_PATH"
        echo "  Last modified: $(find "$WSL_PATH" -name "*.tsx" -o -name "*.ts" | grep -v node_modules | head -1 | xargs stat -c %y 2>/dev/null | cut -d. -f1 || echo 'Unknown')"
    else
        print_warning "WSL: ✗ (not found)"
    fi
    
    echo
    print_status "Available backups:"
    ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -5 || echo "  No backups found"
}

show_help() {
    echo -e "${BLUE}Shwan Orthodontics Project Sync Tool${NC}"
    echo
    echo "Usage: $0 {command}"
    echo
    echo "Commands:"
    echo "  to-wsl      Sync Windows → WSL (for development)"
    echo "  to-windows  Sync WSL → Windows (after development)"
    echo "  smart       Auto-detect which direction to sync"
    echo "  status      Show current status of both versions"
    echo "  backup      Create manual backup of both versions"
    echo "  help        Show this help message"
    echo
    echo "Recommended workflow:"
    echo "  1. Start development: ./sync.sh to-wsl"
    echo "  2. Work in WSL: cd ~/projects/shwan-orthodontics"
    echo "  3. After development: ./sync.sh to-windows"
    echo "  4. Check status: ./sync.sh status"
    echo
    echo "Quick development setup:"
    echo "  ./sync.sh smart && cd ~/projects/shwan-orthodontics"
}

manual_backup() {
    print_status "Creating manual backups..."
    create_backup "$WINDOWS_PATH" "windows_manual"
    create_backup "$WSL_PATH" "wsl_manual"
    print_success "Manual backups created in $BACKUP_DIR"
}

# Main script logic
case "$1" in
    "to-wsl")
        sync_to_wsl
        ;;
    "to-windows")
        sync_to_windows
        ;;
    "smart")
        smart_sync
        ;;
    "status")
        show_status
        ;;
    "backup")
        manual_backup
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        print_error "No command specified."
        echo
        show_help
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac
