#!/bin/bash

################################################################################
# Psychologist AI - Secure Setup & Deployment Script
# This script handles all setup steps securely
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Main script
main() {
    print_header "🌙 Psychologist AI - Setup & Deploy"
    
    # Step 1: Check prerequisites
    print_header "Step 1: Checking Prerequisites"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install from https://nodejs.org"
        exit 1
    fi
    print_success "Node.js $(node --version) found"
    
    if ! command -v npm &> /dev/null; then
        print_error "npm not found"
        exit 1
    fi
    print_success "npm $(npm --version) found"
    
    # Step 2: Install Wrangler
    print_header "Step 2: Installing Dependencies"
    
    if ! command -v wrangler &> /dev/null; then
        print_info "Installing Wrangler CLI..."
        npm install -g wrangler
        print_success "Wrangler installed"
    else
        print_success "Wrangler $(wrangler --version) already installed"
    fi
    
    # Step 3: Install project dependencies
    print_info "Installing project dependencies..."
    npm install
    print_success "Dependencies installed"
    
    # Step 4: Authentication
    print_header "Step 3: CloudFlare Authentication"
    
    if wrangler whoami &> /dev/null; then
        print_success "Already authenticated with CloudFlare"
        wrangler whoami
    else
        print_warning "Not authenticated. Opening CloudFlare login..."
        wrangler login
        print_success "Authentication complete"
    fi
    
    # Step 5: Get account info
    print_header "Step 4: Account Information"
    wrangler whoami
    print_info "Account ID will be used for deployment"
    
    # Step 6: Setup OpenAI API Key
    print_header "Step 5: OpenAI API Key Configuration"
    
    print_warning "IMPORTANT: Use a FRESH OpenAI API key"
    print_info "Do NOT reuse or share keys"
    print_info ""
    print_info "To create a new key:"
    print_info "1. Go to: https://platform.openai.com/api-keys"
    print_info "2. Click 'Create new secret key'"
    print_info "3. Copy the key (shown only once)"
    print_info ""
    
    read -p "Press Enter to add your OpenAI API key..."
    
    wrangler secret put OPENAI_API_KEY
    
    if wrangler secret list 2>/dev/null | grep -q "OPENAI_API_KEY"; then
        print_success "OPENAI_API_KEY configured securely"
    else
        print_error "Failed to set API key"
        exit 1
    fi
    
    # Step 7: Verify configuration
    print_header "Step 6: Verifying Configuration"
    
    if [ -f "wrangler.toml" ]; then
        print_success "wrangler.toml found"
    else
        print_error "wrangler.toml not found"
        exit 1
    fi
    
    if [ -f "functions/index.js" ]; then
        print_success "functions/index.js found"
    else
        print_error "functions/index.js not found"
        exit 1
    fi
    
    # Step 8: Deploy
    print_header "Step 7: Deploying to CloudFlare"
    
    read -p "Ready to deploy? (yes/no): " -r
    echo
    
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Deploying worker..."
        wrangler deploy
        print_success "Deployment complete!"
    else
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    # Step 9: Verification
    print_header "Step 8: Verifying Deployment"
    
    print_info "Checking worker health..."
    sleep 5
    
    if curl -s https://psychologist-ai.mesarcophagus-web.workers.dev/api/health | grep -q "ok"; then
        print_success "Worker is running!"
    else
        print_warning "Worker might still be initializing... Check dashboard"
    fi
    
    # Final summary
    print_header "🎉 Setup Complete!"
    
    echo -e "${GREEN}Your Psychologist AI is deployed!${NC}\n"
    
    echo "📱 Access your app:"
    echo "   https://psychologist-ai.mesarcophagus-web.workers.dev"
    echo ""
    
    echo "📊 View live logs:"
    echo "   wrangler tail"
    echo ""
    
    echo "📋 View deployments:"
    echo "   wrangler deployments list"
    echo ""
    
    echo "🔄 Redeploy anytime:"
    echo "   wrangler deploy"
    echo ""
    
    echo "❓ For help:"
    echo "   See README.md and DEPLOYMENT.md"
    echo ""
}

# Run main function
main "$@"
