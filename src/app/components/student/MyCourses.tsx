import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, Calendar, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  schedule: string;
  instructor_name: string;
  enrollment_status: string;
  start_date: string;
  end_date: string;
  level: string;
}

export function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;

    try {
      // Get student record
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!studentData) {
        toast.error('Student record not found');
        return;
      }

      // Get enrolled courses with instructor info
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          status,
          enrollment_date,
          courses (
            id,
            name,
            code,
            description,
            schedule,
            start_date,
            end_date,
            level,
            instructors (
              name,
              surname
            )
          )
        `)
        .eq('student_id', studentData.id);

      if (error) throw error;

      const formattedCourses = data?.map((enrollment: any) => ({
        id: enrollment.courses.id,
        name: enrollment.courses.name,
        code: enrollment.courses.code,
        description: enrollment.courses.description,
        schedule: enrollment.courses.schedule,
        instructor_name: enrollment.courses.instructors
          ? `${enrollment.courses.instructors.name} ${enrollment.courses.instructors.surname}`
          : 'TBA',
        enrollment_status: enrollment.status,
        start_date: enrollment.courses.start_date,
        end_date: enrollment.courses.end_date,
        level: enrollment.courses.level,
      })) || [];

      setCourses(formattedCourses);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">View and manage your enrolled courses</p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 text-center">
              You're not enrolled in any courses. Contact the administration to enroll.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{course.name}</CardTitle>
                    <CardDescription className="text-sm">{course.code}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level || 'N/A'}
                    </Badge>
                    <Badge className={getStatusColor(course.enrollment_status)}>
                      {course.enrollment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description || 'No description available'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">Instructor:</span>
                    <span className="ml-2">{course.instructor_name}</span>
                  </div>

                  {course.schedule && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Schedule:</span>
                      <span className="ml-2">{course.schedule}</span>
                    </div>
                  )}

                  {course.start_date && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">
                        {new Date(course.start_date).toLocaleDateString()} -{' '}
                        {course.end_date ? new Date(course.end_date).toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
