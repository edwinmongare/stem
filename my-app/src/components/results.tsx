import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemoryStick, PercentDiamond, Ruler } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const notifications = [
  {
    title: "Number of Stems",
    description: "23",
    icon: <MemoryStick />,
  },
  {
    title: "Average Length (cm)",
    description: "4.5",
    icon: <Ruler />,
  },
  {
    title: "Average Width (cm)",
    description: "0.5",
    icon: <Ruler />,
  },
  {
    title: "% Stems above 4.5cm",
    description: "3%",
    icon: <PercentDiamond />,
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function Results({ className, ...props }: CardProps) {
  return (
    <Card className={`w-full bg-[#ECECEC] ${className}`} {...props}>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>Here are the results from your image</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2">
        <ScrollArea className="max-h-[400px] my-auto w-full overflow-y-hidden p-4">
          <div className="grid grid-cols-2 gap-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[0px_1fr] items-center pb-0 "
              >
                <span className="flex h-0 w-0 translate-y-1 rounded-full bg-[#ECECEC]" />
                <div className="space-y-1 rounded-md border border-white shadow-lg px-4 py-4">
                  <span> {notification.icon}</span>
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
