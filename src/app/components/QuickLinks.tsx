import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { quickLinks } from '../lib/mockData';

export function QuickLinks() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Quick Links</h2>
        <p className="text-slate-600 mt-1">Easy access to important educational websites and resources</p>
      </div>

      <div className="space-y-6">
        {quickLinks.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="text-4xl mb-3">{link.icon}</div>
                        <h3 className="font-medium mb-2">{link.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <span>Visit site</span>
                          <ExternalLink className="size-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-4">
            If you need assistance with any of these services or have questions about test registrations and university applications, please contact our guidance counselor.
          </p>
          <Button>Contact Guidance Counselor</Button>
        </CardContent>
      </Card>
    </div>
  );
}
