import { Link } from 'wouter';
import { Leaf, Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API', href: '/api' },
    { name: 'Integrations', href: '#integrations' },
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '#docs' },
    { name: 'GHG Protocol Guide', href: '#ghg-guide' },
    { name: 'Blockchain Verification', href: '#blockchain' },
    { name: 'Support', href: '#support' },
  ];

  const companyLinks = [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-forest-900 dark:bg-forest-950 text-forest-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-600 to-sage-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-forest-50" />
              </div>
              <h3 className="text-xl font-bold">CarbonCoPilot</h3>
            </div>
            <p className="text-sage-300 dark:text-sage-400 mb-4 text-sm leading-relaxed">
              AI-powered carbon calculator with GHG Protocol compliance and blockchain verification.
              Transform your sustainability journey with intelligent carbon footprint management.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-forest-50">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors text-sm cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-forest-50">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors text-sm cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-forest-50">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors text-sm cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-forest-800 dark:border-forest-900 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sage-300 dark:text-sage-400 text-sm">
              © {currentYear} CarbonCoPilot. All rights reserved. GHG Protocol compliant. Powered by Hedera Guardian.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#privacy">
                <span className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors text-sm cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
              <Link href="#terms">
                <span className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors text-sm cursor-pointer">
                  Terms of Service
                </span>
              </Link>
              <Link href="#cookies">
                <span className="text-sage-300 dark:text-sage-400 hover:text-forest-50 transition-colors text-sm cursor-pointer">
                  Cookie Policy
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
