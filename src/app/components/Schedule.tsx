import { useEffect, useState } from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { scheduleController } from '../../mvc/controllers/scheduleController';
import type { ScheduleItemView } from '../../mvc/models/scheduleModel';
import { toast } from 'sonner';

export function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItemView[]>([]);
  const [selectedDay, setSelectedDay] = useState('all');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    void loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const data = await scheduleController.listSchedule();
      setSchedule(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedule = selectedDay === 'all'
    ? schedule
    : schedule.filter((item) => item.day === selectedDay);

  const scheduleByDay = days.reduce((acc, day) => {
    acc[day] = schedule.filter((item) => item.day === day);
    return acc;
  }, {} as Record<string, ScheduleItemView[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Class Schedule</h2>
        <p className="text-slate-600 mt-1">Weekly class timetable</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedDay}>
        <TabsList>
          <TabsTrigger value="all">All Days</TabsTrigger>
          {days.map((day) => (
            <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading schedule...</div>
          ) : (
            <div className="space-y-6">
              {days.map((day) => (
                <div key={day}>
                  <h3 className="text-lg font-semibold mb-3">{day}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scheduleByDay[day].map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold">{item.course_name}</h4>
                            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {item.duration}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <User className="size-4" />
                              <span>{item.instructor_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="size-4" />
                              <span>{item.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="size-4" />
                              <span>{item.room}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {scheduleByDay[day].length === 0 && (
                      <Card><CardContent className="p-6 text-slate-500">No classes scheduled.</CardContent></Card>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {days.map((day) => (
          <TabsContent key={day} value={day} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchedule
                .filter((item) => item.day === day)
                .map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{item.course_name}</h4>
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {item.duration}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="size-4" />
                          <span>{item.instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="size-4" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="size-4" />
                          <span>{item.room}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-center">
              {days.map((day) => (
                <div key={day} className="space-y-2">
                  <div className="font-medium text-sm">{day}</div>
                  <div className="text-2xl font-semibold text-blue-600">{scheduleByDay[day].length}</div>
                  <div className="text-xs text-slate-600">classes</div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Classes This Week</span>
                <span className="text-xl font-semibold">{schedule.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
