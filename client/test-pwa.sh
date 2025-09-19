#!/bin/bash

# SPARK PWA Testing Script
# Tests various PWA functionality and validates configuration

echo "🔍 SPARK PWA Testing & Validation Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}: $2"
        ((FAILED++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARNING${NC}: $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

# Check if we're in the client directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in client directory. Please run from /client folder${NC}"
    exit 1
fi

echo ""
echo "📁 Checking file structure..."

# Check for required PWA files
test -f "public/manifest.json"
print_result $? "Web App Manifest exists"

test -f "public/sw.js"
print_result $? "Service Worker exists"

test -f "public/browserconfig.xml"
print_result $? "Browser config exists"

test -d "public/icons"
print_result $? "Icons directory exists"

# Check for required icons
REQUIRED_ICONS=("icon-16x16.png" "icon-32x32.png" "icon-192x192.png" "icon-512x512.png")
for icon in "${REQUIRED_ICONS[@]}"; do
    test -f "public/icons/$icon"
    print_result $? "Required icon: $icon"
done

# Check React components
test -f "src/components/pwa-installer.tsx"
print_result $? "PWA Installer component exists"

test -f "src/app/offline/page.tsx"
print_result $? "Offline page exists"

test -f "src/lib/pwa-utils.ts"
print_result $? "PWA utilities exist"

echo ""
echo "🔍 Validating manifest.json..."

# Check if manifest.json is valid JSON
if command -v jq >/dev/null 2>&1; then
    jq empty public/manifest.json 2>/dev/null
    print_result $? "Manifest JSON is valid"
    
    # Check required manifest fields
    NAME=$(jq -r '.name' public/manifest.json 2>/dev/null)
    if [ "$NAME" != "null" ] && [ "$NAME" != "" ]; then
        print_result 0 "Manifest has name field"
    else
        print_result 1 "Manifest missing name field"
    fi
    
    START_URL=$(jq -r '.start_url' public/manifest.json 2>/dev/null)
    if [ "$START_URL" != "null" ] && [ "$START_URL" != "" ]; then
        print_result 0 "Manifest has start_url field"
    else
        print_result 1 "Manifest missing start_url field"
    fi
    
    DISPLAY=$(jq -r '.display' public/manifest.json 2>/dev/null)
    if [ "$DISPLAY" = "standalone" ] || [ "$DISPLAY" = "fullscreen" ] || [ "$DISPLAY" = "minimal-ui" ]; then
        print_result 0 "Manifest has valid display mode"
    else
        print_result 1 "Manifest has invalid display mode: $DISPLAY"
    fi
    
    ICONS_COUNT=$(jq '.icons | length' public/manifest.json 2>/dev/null)
    if [ "$ICONS_COUNT" -gt 0 ]; then
        print_result 0 "Manifest has icons defined"
    else
        print_result 1 "Manifest missing icons"
    fi
    
else
    print_warning "jq not installed - skipping JSON validation"
fi

echo ""
echo "🔧 Checking Next.js configuration..."

# Check if Next.js config exists and has PWA optimizations
if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
    print_result 0 "Next.js config file exists"
    
    # Check for PWA-related configurations
    if grep -q "headers\|compress\|images" next.config.* 2>/dev/null; then
        print_result 0 "Next.js config has PWA optimizations"
    else
        print_warning "Next.js config may be missing PWA optimizations"
    fi
else
    print_result 1 "Next.js config file missing"
fi

echo ""
echo "📦 Checking package.json for PWA dependencies..."

# Check for required dependencies
if command -v jq >/dev/null 2>&1; then
    DEPS=$(jq -r '.dependencies // {}' package.json 2>/dev/null)
    
    # Check for essential PWA-related packages
    if echo "$DEPS" | grep -q "next"; then
        print_result 0 "Next.js dependency found"
    else
        print_result 1 "Next.js dependency missing"
    fi
    
    if echo "$DEPS" | grep -q "react"; then
        print_result 0 "React dependency found"
    else
        print_result 1 "React dependency missing"
    fi
    
else
    print_warning "Cannot validate package.json dependencies"
fi

echo ""
echo "🌐 Network & HTTPS checks..."

# Check if running on localhost or if HTTPS is configured
if [ -n "$VERCEL_URL" ] || [ -n "$NETLIFY_URL" ] || [ -n "$HEROKU_APP_NAME" ]; then
    print_result 0 "Deployment platform detected (HTTPS likely configured)"
else
    print_warning "Make sure HTTPS is configured for production deployment"
fi

echo ""
echo "🧪 PWA Feature Testing (requires browser)..."

print_info "Manual testing required for the following:"
echo "  • Install prompt appears in supported browsers"
echo "  • Service worker registers successfully"
echo "  • Offline functionality works"
echo "  • App shortcuts function correctly"
echo "  • Push notifications (if implemented)"
echo "  • Background sync functionality"

echo ""
echo "🚀 Lighthouse PWA Audit..."

# Check if Lighthouse CLI is available
if command -v lighthouse >/dev/null 2>&1; then
    print_info "Lighthouse CLI found. Run 'lighthouse --preset=pwa http://localhost:3000' to audit"
else
    print_warning "Lighthouse CLI not installed. Install with: npm install -g lighthouse"
fi

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 PWA setup looks good! Your app should work as a PWA.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' to start development server"
    echo "2. Open http://localhost:3000 in Chrome"
    echo "3. Check DevTools > Application > Manifest"
    echo "4. Test install prompt and offline functionality"
    echo "5. Run Lighthouse PWA audit"
else
    echo -e "${RED}🔧 Some issues found. Please fix the failed tests above.${NC}"
fi

echo ""
echo "📚 Resources:"
echo "• PWA Checklist: https://web.dev/pwa-checklist/"
echo "• PWABuilder: https://www.pwabuilder.com/"
echo "• Lighthouse: https://developers.google.com/web/tools/lighthouse"
echo "• SPARK PWA Docs: ./PWA_SETUP.md"

echo ""
echo "Happy coding! 🚀"
