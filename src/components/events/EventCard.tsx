import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  venue: string;
  price: number;
  capacity: number;
  registered_count: number;
  status: string;
  image_url: string | null;
  category: string | null;
}

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  const navigate = useNavigate();
  const spotsLeft = event.capacity - event.registered_count;
  const isSoldOut = spotsLeft <= 0;
  const isLowStock = spotsLeft <= 10 && spotsLeft > 0;
  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date();

  const defaultImage = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="glass-card-hover group cursor-pointer overflow-hidden !p-0"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url || defaultImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category badge */}
        {event.category && (
          <span className="absolute top-3 left-3 badge-info">
            {event.category}
          </span>
        )}
        
        {/* Status badges */}
        {isPast ? (
          <span className="absolute top-3 right-3 badge-warning">Ended</span>
        ) : isSoldOut ? (
          <span className="absolute top-3 right-3 badge-error">Sold Out</span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 badge-warning">
            Only {spotsLeft} left
          </span>
        ) : null}

        {/* Price */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/90 text-white text-sm font-semibold">
          {event.price === 0 ? (
            'Free'
          ) : (
            <>
              <IndianRupee className="w-3.5 h-3.5" />
              {event.price}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 font-['Space_Grotesk']">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            {format(eventDate, 'EEE, MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            {format(eventDate, 'h:mm a')}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            {event.registered_count} / {event.capacity} registered
          </div>
        </div>

        <Button
          className="w-full btn-gradient"
          disabled={isSoldOut || isPast}
        >
          {isPast ? 'Event Ended' : isSoldOut ? 'Sold Out' : 'Register Now'}
        </Button>
      </div>
    </motion.div>
  );
};

export default EventCard;
