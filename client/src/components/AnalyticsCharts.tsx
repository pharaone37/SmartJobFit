import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartsProps {
  type: "timeline" | "salary" | "skills" | "applications" | "performance";
  data?: any[];
  className?: string;
}

export default function AnalyticsCharts({ type, data = [], className = "" }: AnalyticsChartsProps) {
  const chartData = useMemo(() => {
    switch (type) {
      case "timeline":
        return generateTimelineData(data);
      case "salary":
        return generateSalaryData(data);
      case "skills":
        return generateSkillsData(data);
      case "applications":
        return generateApplicationsData(data);
      case "performance":
        return generatePerformanceData(data);
      default:
        return [];
    }
  }, [type, data]);

  const colors = {
    primary: "hsl(262.1, 83.3%, 57.8%)",
    secondary: "hsl(221.2, 83.2%, 53.3%)",
    success: "hsl(142.1, 76.2%, 36.3%)",
    warning: "hsl(47.9, 95.8%, 53.1%)",
    destructive: "hsl(0, 84.2%, 60.2%)",
    muted: "hsl(210, 40%, 96%)"
  };

  const renderChart = () => {
    switch (type) {
      case "timeline":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214.3, 31.8%, 91.4%)",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="applications"
                stackId="1"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
                name="Applications"
              />
              <Area
                type="monotone"
                dataKey="responses"
                stackId="1"
                stroke={colors.secondary}
                fill={colors.secondary}
                fillOpacity={0.6}
                name="Responses"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "salary":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis 
                dataKey="range" 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214.3, 31.8%, 91.4%)",
                  borderRadius: "8px"
                }}
              />
              <Bar 
                dataKey="count" 
                fill={colors.success}
                radius={[4, 4, 0, 0]}
                name="Job Count"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "skills":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis 
                type="number" 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey="skill" 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214.3, 31.8%, 91.4%)",
                  borderRadius: "8px"
                }}
              />
              <Bar 
                dataKey="demand" 
                fill={colors.primary}
                radius={[0, 4, 4, 0]}
                name="Market Demand"
              />
              <Bar 
                dataKey="proficiency" 
                fill={colors.secondary}
                radius={[0, 4, 4, 0]}
                name="Your Proficiency"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "applications":
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({
          cx, cy, midAngle, innerRadius, outerRadius, percent
        }: any) => {
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text 
              x={x} 
              y={y} 
              fill="white" 
              textAnchor={x > cx ? 'start' : 'end'} 
              dominantBaseline="central"
              fontSize={12}
              fontWeight="bold"
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        };

        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214.3, 31.8%, 91.4%)",
                  borderRadius: "8px"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "performance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis 
                dataKey="session" 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(215.4, 16.3%, 46.9%)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214.3, 31.8%, 91.4%)",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke={colors.primary}
                strokeWidth={3}
                dot={{ fill: colors.primary, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
                name="Interview Score"
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke={colors.secondary}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                name="Confidence Level"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Chart type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {renderChart()}
    </div>
  );
}

// Data generation functions
function generateTimelineData(applications: any[] = []) {
  // Generate last 30 days of data
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Count applications for this date (if real data is available)
    const dateStr = date.toISOString().split('T')[0];
    const dayApplications = applications.filter(app => 
      app.appliedAt && app.appliedAt.startsWith(dateStr)
    ).length;
    
    // Generate realistic data if no real data
    const applicationsCount = dayApplications || (Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0);
    const responsesCount = Math.floor(applicationsCount * (0.2 + Math.random() * 0.3));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      applications: applicationsCount,
      responses: responsesCount,
    });
  }
  
  return data;
}

function generateSalaryData(applications: any[] = []) {
  const ranges = [
    { range: "$60k-80k", count: 0 },
    { range: "$80k-100k", count: 0 },
    { range: "$100k-120k", count: 0 },
    { range: "$120k-150k", count: 0 },
    { range: "$150k+", count: 0 },
  ];

  // If we have real application data, analyze it
  applications.forEach(app => {
    if (app.job?.salaryMin) {
      const salary = app.job.salaryMin;
      if (salary < 80000) ranges[0].count++;
      else if (salary < 100000) ranges[1].count++;
      else if (salary < 120000) ranges[2].count++;
      else if (salary < 150000) ranges[3].count++;
      else ranges[4].count++;
    }
  });

  // If no real data, generate sample data
  if (ranges.every(r => r.count === 0)) {
    ranges[0].count = 3;
    ranges[1].count = 8;
    ranges[2].count = 12;
    ranges[3].count = 15;
    ranges[4].count = 7;
  }

  return ranges;
}

function generateSkillsData(data: any[] = []) {
  return [
    { skill: "React", demand: 95, proficiency: 90 },
    { skill: "Python", demand: 88, proficiency: 85 },
    { skill: "JavaScript", demand: 92, proficiency: 88 },
    { skill: "AWS", demand: 80, proficiency: 70 },
    { skill: "Node.js", demand: 75, proficiency: 82 },
    { skill: "Docker", demand: 70, proficiency: 65 },
  ];
}

function generateApplicationsData(applications: any[] = []) {
  const statusCounts = {
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  // Count real application statuses
  applications.forEach(app => {
    if (statusCounts.hasOwnProperty(app.status)) {
      statusCounts[app.status as keyof typeof statusCounts]++;
    }
  });

  // If no real data, use sample data
  if (Object.values(statusCounts).every(count => count === 0)) {
    statusCounts.applied = 15;
    statusCounts.interview = 6;
    statusCounts.offer = 2;
    statusCounts.rejected = 4;
  }

  return [
    { name: "Applied", value: statusCounts.applied, color: "hsl(221.2, 83.2%, 53.3%)" },
    { name: "Interview", value: statusCounts.interview, color: "hsl(142.1, 76.2%, 36.3%)" },
    { name: "Offer", value: statusCounts.offer, color: "hsl(47.9, 95.8%, 53.1%)" },
    { name: "Rejected", value: statusCounts.rejected, color: "hsl(0, 84.2%, 60.2%)" },
  ];
}

function generatePerformanceData(data: any[] = []) {
  // Generate 10 mock interview sessions with improving scores
  const sessions = [];
  for (let i = 1; i <= 10; i++) {
    const baseScore = 60 + (i * 3) + (Math.random() * 10 - 5); // Trending upward with some variance
    sessions.push({
      session: `Session ${i}`,
      score: Math.min(95, Math.max(50, Math.round(baseScore))),
      confidence: Math.min(90, Math.max(40, Math.round(baseScore - 5 + Math.random() * 10))),
    });
  }
  return sessions;
}
