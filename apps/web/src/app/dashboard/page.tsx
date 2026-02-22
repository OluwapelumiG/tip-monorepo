import { auth } from "@illtip/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const stats = [
    { title: "Total Jobs Applied", value: "12", icon: Briefcase, color: "text-blue-500" },
    { title: "Interviews Scheduled", value: "4", icon: Clock, color: "text-orange-500" },
    { title: "Offers Received", value: "1", icon: CheckCircle, color: "text-green-500" },
    { title: "Saved Jobs", value: "8", icon: FileText, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}</h2>
        <p className="text-muted-foreground">Here's an overview of your job search progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">Software Engineer</p>
                      <p className="text-sm text-muted-foreground">Tech Corp Inc.</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600">
                      Applied
                    </span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recommended Jobs</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-muted/50" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Frontend Developer</p>
                      <p className="text-xs text-muted-foreground">Remote • $100k - $120k</p>
                    </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
