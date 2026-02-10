import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

interface CourseCardProps {
  course: Tables<"courses">;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const discountedPrice = course.discount
    ? course.price * (1 - course.discount / 100)
    : course.price;

  return (
    <Card
      className="glow-card cursor-pointer overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="aspect-video w-full overflow-hidden bg-secondary">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center gradient-bg opacity-30">
            <span className="text-3xl font-display font-bold text-primary-foreground/50">{course.title[0]}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        {course.category && (
          <Badge variant="secondary" className="mb-2 text-xs">{course.category}</Badge>
        )}
        <h3 className="font-display font-semibold text-lg line-clamp-1 mb-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg gradient-text">₹{discountedPrice.toFixed(0)}</span>
          {course.discount && course.discount > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through">₹{course.price.toFixed(0)}</span>
              <Badge className="gradient-bg text-xs border-0">{course.discount}% OFF</Badge>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
