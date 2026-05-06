import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface CourseCardProps {
  course: Tables<"courses">;
}

const formatPrice = (value: number) =>
  `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const discountedPrice = course.discount
    ? course.price * (1 - course.discount / 100)
    : course.price;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className="group shine-card glow-card course-card-hover cursor-pointer overflow-hidden glass-card-strong"
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-secondary">
          {course.thumbnail_url ? (
            <>
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black/40 to-black/60">
              <span className="font-display text-6xl text-white/30">
                {course.title[0]}
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {course.category && (
              <Badge
                variant="outline"
                className="border-white/12 bg-black/40 text-[0.65rem] text-white/75 backdrop-blur-sm"
              >
                {course.category}
              </Badge>
            )}
            {course.discount && course.discount > 0 && (
              <Badge className="gradient-bg border-transparent text-[0.65rem] font-bold">
                {course.discount}% Off
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="space-y-5 p-4 sm:p-5 md:p-6">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl text-white tracking-wide">
              {course.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-[0.75rem] sm:text-[0.82rem] leading-[1.8] text-muted-foreground">
              {course.description}
            </p>
          </div>

          <div className="flex items-end justify-between gap-3 sm:gap-4">
            <div>
              <p className="font-display text-3xl sm:text-4xl md:text-5xl gradient-text tracking-wider">
                {formatPrice(discountedPrice)}
              </p>
              {course.discount && course.discount > 0 && (
                <p className="text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/32 line-through">
                  {formatPrice(course.price)}
                </p>
              )}
            </div>

            <Button
              size="sm"
              className="gradient-bg glow-button border-transparent text-[0.65rem] sm:text-[0.75rem] font-bold px-3 sm:px-4"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/courses/${course.id}`);
              }}
            >
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Buy Now</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
