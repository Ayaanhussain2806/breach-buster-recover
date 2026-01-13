import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Loader2,
  CheckCircle,
  XCircle,
  QrCode,
} from 'lucide-react';
import { format } from 'date-fns';

interface Pass {
  id: string;
  qr_code_hash: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
  event: {
    id: string;
    title: string;
    event_date: string;
    venue: string;
    image_url: string | null;
  };
}

const MyPasses = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchPasses();
    }
  }, [user, authLoading]);

  const fetchPasses = async () => {
    try {
      const { data, error } = await supabase
        .from('passes')
        .select(`
          id,
          qr_code_hash,
          is_used,
          used_at,
          created_at,
          event:events (
            id,
            title,
            event_date,
            venue,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPasses(data as unknown as Pass[] || []);
    } catch (error) {
      console.error('Error fetching passes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openQRDialog = (pass: Pass) => {
    setSelectedPass(pass);
    setQrDialogOpen(true);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const activePasses = passes.filter((pass) => {
    const eventDate = new Date(pass.event.event_date);
    return eventDate >= new Date() && !pass.is_used;
  });

  const usedOrPastPasses = passes.filter((pass) => {
    const eventDate = new Date(pass.event.event_date);
    return eventDate < new Date() || pass.is_used;
  });

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Space_Grotesk']">My Passes</h1>
            <p className="text-muted-foreground mt-1">Your event tickets and entry passes</p>
          </div>
        </div>

        {passes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card text-center py-16"
          >
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Passes Yet</h3>
            <p className="text-muted-foreground mb-6">
              Register for events to get your digital passes
            </p>
            <Button onClick={() => navigate('/')} className="btn-gradient">
              Browse Events
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Active Passes */}
            {activePasses.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Active Passes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePasses.map((pass, index) => (
                    <PassCard
                      key={pass.id}
                      pass={pass}
                      index={index}
                      onShowQR={() => openQRDialog(pass)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Used/Past Passes */}
            {usedOrPastPasses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                  Past / Used Passes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {usedOrPastPasses.map((pass, index) => (
                    <PassCard
                      key={pass.id}
                      pass={pass}
                      index={index}
                      onShowQR={() => openQRDialog(pass)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* QR Code Dialog */}
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="glass-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white font-['Space_Grotesk']">
                {selectedPass?.event.title}
              </DialogTitle>
            </DialogHeader>
            {selectedPass && (
              <div className="text-center py-6">
                <div className="inline-block p-4 bg-white rounded-2xl mb-4">
                  <QRCodeSVG
                    value={selectedPass.qr_code_hash}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Scan this QR code at the event entrance
                </p>
                {selectedPass.is_used ? (
                  <span className="badge-error">Already Used</span>
                ) : (
                  <span className="badge-success">Valid for Entry</span>
                )}
                <div className="mt-6 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    {format(new Date(selectedPass.event.event_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    {format(new Date(selectedPass.event.event_date), 'h:mm a')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedPass.event.venue}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
};

interface PassCardProps {
  pass: Pass;
  index: number;
  onShowQR: () => void;
}

const PassCard: React.FC<PassCardProps> = ({ pass, index, onShowQR }) => {
  const eventDate = new Date(pass.event.event_date);
  const defaultImage = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=60`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card-hover !p-0 overflow-hidden"
    >
      <div className="relative h-32">
        <img
          src={pass.event.image_url || defaultImage}
          alt={pass.event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {pass.is_used && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="badge-error text-sm">USED</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-1">{pass.event.title}</h3>
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(eventDate, 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{pass.event.venue}</span>
          </div>
        </div>
        <Button
          onClick={onShowQR}
          className="w-full gap-2"
          variant={pass.is_used ? 'outline' : 'default'}
        >
          <QrCode className="w-4 h-4" />
          {pass.is_used ? 'View Pass' : 'Show QR Code'}
        </Button>
      </div>
    </motion.div>
  );
};

export default MyPasses;
