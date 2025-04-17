
import { Link } from "react-router-dom";
import { 
  Laptop, 
  Music, 
  Briefcase, 
  Lightbulb, 
  Users, 
  HeartPulse,
  PenTool,
  UtensilsCrossed
} from "lucide-react";

interface CategoryProps {
  icon: React.ReactNode;
  name: string;
  color: string;
  link: string;
}

function CategoryCard({ icon, name, color, link }: CategoryProps) {
  return (
    <Link 
      to={link}
      className={`group flex flex-col items-center p-6 rounded-lg transition-all hover:-translate-y-1 ${color}`}
    >
      <div className="mb-3 text-white">{icon}</div>
      <h3 className="text-lg font-medium text-white">{name}</h3>
    </Link>
  );
}

export function Categories() {
  const categories = [
    {
      icon: <Laptop size={32} />,
      name: "Technology",
      color: "bg-blue-600 hover:bg-blue-700",
      link: "/events?category=Technology"
    },
    {
      icon: <Music size={32} />,
      name: "Music",
      color: "bg-purple-600 hover:bg-purple-700",
      link: "/events?category=Music"
    },
    {
      icon: <Briefcase size={32} />,
      name: "Business",
      color: "bg-amber-600 hover:bg-amber-700",
      link: "/events?category=Business"
    },
    {
      icon: <Lightbulb size={32} />,
      name: "Education",
      color: "bg-green-600 hover:bg-green-700",
      link: "/events?category=Education"
    },
    {
      icon: <Users size={32} />,
      name: "Networking",
      color: "bg-red-600 hover:bg-red-700",
      link: "/events?category=Networking"
    },
    {
      icon: <HeartPulse size={32} />,
      name: "Health",
      color: "bg-pink-600 hover:bg-pink-700", 
      link: "/events?category=Health"
    },
    {
      icon: <PenTool size={32} />,
      name: "Arts",
      color: "bg-indigo-600 hover:bg-indigo-700",
      link: "/events?category=Arts"
    },
    {
      icon: <UtensilsCrossed size={32} />,
      name: "Food",
      color: "bg-orange-600 hover:bg-orange-700",
      link: "/events?category=Food"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Explore by Category</h2>
          <p className="mt-3 text-muted-foreground">
            Find events that match your interests
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              icon={category.icon}
              name={category.name}
              color={category.color}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
