import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Mail, ShieldCheck, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithRole {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [actionType, setActionType] = useState<'reset' | 'toggle-role' | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get all user roles with user emails
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user details from auth.users metadata
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to view users.',
          variant: 'destructive'
        });
        return;
      }

      // For each user role, we need to get their email
      // Since we can't directly query auth.users from client, we'll use the user_id
      const usersWithRoles: UserWithRole[] = [];
      
      for (const userRole of userRoles || []) {
        // Try to get user metadata if available
        usersWithRoles.push({
          id: userRole.user_id,
          email: userRole.user_id, // Will display user ID for now
          role: userRole.role,
          created_at: userRole.created_at
        });
      }

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: 'Error loading users',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        selectedUser.email,
        {
          redirectTo: `${window.location.origin}/auth`
        }
      );

      if (error) throw error;

      toast({
        title: 'Password reset email sent',
        description: `A password reset link has been sent to ${selectedUser.email}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error sending reset email',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const handleToggleAdminRole = async () => {
    if (!selectedUser) return;

    try {
      const isCurrentlyAdmin = selectedUser.role === 'admin';
      
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.id)
          .eq('role', 'admin');

        if (error) throw error;

        toast({
          title: 'Admin role removed',
          description: `User no longer has admin privileges.`,
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: selectedUser.id,
            role: 'admin'
          });

        if (error) throw error;

        toast({
          title: 'Admin role granted',
          description: `User now has admin privileges.`,
        });
      }

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error updating role',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const openDialog = (user: UserWithRole, action: 'reset' | 'toggle-role') => {
    setSelectedUser(user);
    setActionType(action);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/management">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Management
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              View and manage user accounts with administrative access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(user, 'reset')}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Reset Password
                        </Button>
                        <Button
                          variant={user.role === 'admin' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => openDialog(user, 'toggle-role')}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <ShieldX className="mr-2 h-4 w-4" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={actionType === 'reset'} onOpenChange={(open) => !open && setActionType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset User Password</AlertDialogTitle>
              <AlertDialogDescription>
                This will send a password reset email to the user. They will receive a link to set a new password.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={actionType === 'toggle-role'} onOpenChange={(open) => !open && setActionType(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedUser?.role === 'admin' ? 'Remove Admin Role' : 'Grant Admin Role'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedUser?.role === 'admin' 
                  ? 'This user will lose administrative privileges and will no longer be able to manage beverages, taps, or settings.'
                  : 'This user will gain administrative privileges and will be able to manage beverages, taps, and settings.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleAdminRole}>
                {selectedUser?.role === 'admin' ? 'Remove Role' : 'Grant Role'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserManagement;
