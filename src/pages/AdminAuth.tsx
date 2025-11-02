import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Shield, Lock } from 'lucide-react';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();

        if (roles) {
          navigate('/admin/dashboard');
        }
      }
    };

    // Check if signup is enabled
    const checkSignupStatus = async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'signup_enabled')
        .single();

      setSignupEnabled(data?.setting_value ?? true);
    };

    checkAuth();
    checkSignupStatus();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user is admin
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (!roles) {
          await supabase.auth.signOut();
          throw new Error('Access denied. Admin privileges required.');
        }

        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in as admin.',
        });

        navigate('/admin/dashboard');
      } else {
        // Signup (only if enabled)
        if (!signupEnabled) {
          throw new Error('Signup is currently disabled.');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Assign admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'admin',
            });

          if (roleError) throw roleError;

          toast({
            title: 'Account created!',
            description: 'Admin account created successfully. Please check your email to verify.',
          });

          // Optionally disable signup after first admin
          await supabase
            .from('admin_settings')
            .update({ setting_value: false })
            .eq('setting_key', 'signup_enabled');

          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-comfortaa">
            Admin {isLogin ? 'Login' : 'Signup'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Sign in to access the admin dashboard'
              : 'Create your admin account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="w-4 h-4 mr-2" />
              {loading
                ? 'Processing...'
                : isLogin
                ? 'Sign In'
                : 'Create Admin Account'}
            </Button>
          </form>

          {signupEnabled && (
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Button>
            </div>
          )}

          {!signupEnabled && !isLogin && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Signup is currently disabled. Please contact the system administrator.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
