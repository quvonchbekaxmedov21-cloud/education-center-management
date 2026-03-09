import { Card, CardContent } from '../ui/card';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
}

export function ComingSoon({ title, description, features }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <Construction className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            This feature is currently under development and will be available soon.
          </p>

          {features && features.length > 0 && (
            <div className="w-full max-w-md">
              <h4 className="font-medium text-gray-900 mb-3 text-center">Planned Features:</h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
