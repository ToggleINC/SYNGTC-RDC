import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Gavel as GavelIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Stats {
  global: {
    total_criminels: number;
    total_cas: number;
    recidivistes: number;
    danger_eleve: number;
    cas_7_jours: number;
    alertes_non_lues: number;
  };
  par_type_infraction: Array<{ type: string; count: string }>;
  par_region: Array<{ region: string; count: string }>;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  percentage?: string;
  iconBgColor?: string;
}> = ({ title, value, icon, color, percentage, iconBgColor }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: '1px solid #e0e0e0',
      height: '100%',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: '0.85rem', fontWeight: 500, mb: 1 }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 700, color: color, fontSize: '2rem' }}
            >
              {value.toLocaleString()}
            </Typography>
            {percentage && (
              <Typography
                variant="body2"
                sx={{ color: color, fontWeight: 600, fontSize: '0.9rem' }}
              >
                {percentage}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: iconBgColor || `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            fontSize: 28,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchTimeline();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const response = await axios.get('/api/dashboard/charts/timeline?period=30');
      setTimeline(response.data.timeline);
    } catch (error) {
      console.error('Erreur timeline:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography>Erreur de chargement des données</Typography>;
  }

  const infractionData = {
    labels: stats.par_type_infraction.slice(0, 5).map((item) => item.type),
    datasets: [
      {
        label: 'Nombre de cas',
        data: stats.par_type_infraction.slice(0, 5).map((item) => parseInt(item.count)),
        backgroundColor: 'rgba(25, 118, 210, 0.6)',
      },
    ],
  };

  const timelineData = {
    labels: timeline.map((item) => new Date(item.date).toLocaleDateString('fr-FR')),
    datasets: [
      {
        label: 'Nouveaux criminels',
        data: timeline.map((item) => parseInt(item.count)),
        borderColor: 'rgb(25, 118, 210)',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 3 }}>
        Tableau de bord
      </Typography>

      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Criminels"
            value={stats.global.total_criminels}
            icon={<PersonIcon />}
            color="#00b894"
            iconBgColor="#00b89415"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cas"
            value={stats.global.total_cas}
            icon={<GavelIcon />}
            color="#3498db"
            iconBgColor="#3498db15"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Récidivistes"
            value={stats.global.recidivistes}
            percentage={
              stats.global.total_criminels > 0
                ? `${((stats.global.recidivistes / stats.global.total_criminels) * 100).toFixed(1)}%`
                : '0%'
            }
            icon={<TrendingUpIcon />}
            color="#00b894"
            iconBgColor="#00b89415"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Danger Élevé"
            value={stats.global.danger_eleve}
            percentage={
              stats.global.total_criminels > 0
                ? `${((stats.global.danger_eleve / stats.global.total_criminels) * 100).toFixed(1)}%`
                : '0%'
            }
            icon={<WarningIcon />}
            color="#e74c3c"
            iconBgColor="#e74c3c15"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cas (7 jours)"
            value={stats.global.cas_7_jours}
            icon={<GavelIcon />}
            color="#f39c12"
            iconBgColor="#f39c1215"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alertes Non Lues"
            value={stats.global.alertes_non_lues}
            icon={<WarningIcon />}
            color="#9b59b6"
            iconBgColor="#9b59b615"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 2 }}>
              Répartition par type d'infraction
            </Typography>
            <Bar
              data={infractionData}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3436', mb: 2 }}>
              Évolution (30 derniers jours)
            </Typography>
            <Line data={timelineData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

