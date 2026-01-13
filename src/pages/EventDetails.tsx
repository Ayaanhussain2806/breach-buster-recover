import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  IndianRupee,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';

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
  coordinator_id: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [hasPass, setHasPass] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
      if (user) {
        checkExistingPass();
      }
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/');
        return;
      }
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingPass = async () => {
    try {
      const { data, error } = await supabase
        .from('passes')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setHasPass(!!data);
    } catch (error) {
      console.error('Error checking pass:', error);
    }
  };

  const generateQRHash = () => {
    const data = `${user?.id}-${id}-${Date.now()}-${Math.random()}`;
    return CryptoJS.SHA256(data).toString();
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!event) return;

    setRegistering(true);

    try {
      // For free events, directly create pass
      if (event.price === 0) {
        const qrHash = generateQRHash();

        // Create pass
        const { error: passError } = await supabase.from('passes').insert({
          user_id: user.id,
          event_id: event.id,
          qr_code_hash: qrHash,
        });

        if (passError) throw passError;

        // Update registered count
        await supabase
          .from('events')
          .update({ registered_count: event.registered_count + 1 })
          .eq('id', event.id);

        toast({
          title: 'Registration Successful!',
          description: 'Your pass has been generated. Check "My Passes" to view it.',
        });

        setHasPass(true);
        navigate('/passes');
      } else {
        // For paid events, integrate with Razorpay
        toast({
          title: 'Payment Integration',
          description: 'Razorpay payment will be integrated. For now, registering as free.',
        });

        // Temporary: Create pass for demo
        const qrHash = generateQRHash();
        const { error: passError } = await supabase.from('passes').insert({
          user_id: user.id,
          event_id: event.id,
          qr_code_hash: qrHash,
        });

        if (passError) throw passError;

        await supabase
          .from('events')
          .update({ registered_count: event.registered_count + 1 })
          .eq('id', event.id);

        toast({
          title: 'Registration Successful!',
          description: 'Your pass has been generated.',
        });

        setHasPass(true);
        navigate('/passes');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Event Not Found</h3>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date();
  const spotsLeft = event.capacity - event.registered_count;
  const isSoldOut = spotsLeft <= 0;
  const defaultImage = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80`;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
              <img
                src={event.image_url || defaultImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {event.category && (
                <span className="absolute top-4 left-4 badge-info">{event.category}</span>
              )}
            </div>

            {/* Title & Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card mb-6"
            >
              <h1 className="text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">
                {event.title}
              </h1>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description || 'No description provided.'}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card sticky top-28"
            >
              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b border-white/10">
                <span className="text-4xl font-bold text-white font-['Space_Grotesk']">
                  {event.price === 0 ? (
                    'Free'
                  ) : (
                    <span className="flex items-center justify-center">
                      <IndianRupee className="w-8 h-8" />
                      {event.price}
                    </span>
                  )}
                </span>
                <p className="text-muted-foreground text-sm mt-1">per person</p>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {format(eventDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-muted-foreground text-sm">Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{format(eventDate, 'h:mm a')}</p>
                    <p className="text-muted-foreground text-sm">Time</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{event.venue}</p>
                    <p className="text-muted-foreground text-sm">Venue</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {event.registered_count} / {event.capacity}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : 'No spots left'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              {hasPass ? (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">You're registered!</span>
                </div>
              ) : isPast ? (
                <Button className="w-full" disabled>
                  Event Ended
                </Button>
              ) : isSoldOut ? (
                <Button className="w-full" disabled>
                  Sold Out
                </Button>
              ) : (
                <Button
                  className="w-full btn-gradient h-12 text-base"
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Register Now</>
                  )}
                </Button>
              )}

              {hasPass && (
                <Button
                  variant="outline"
                  className="w-full mt-3 border-white/10"
                  onClick={() => navigate('/passes')}
                >
                  View My Pass
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default EventDetails;
