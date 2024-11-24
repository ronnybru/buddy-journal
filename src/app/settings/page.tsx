import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/settings/profile-form"
import { PasswordForm } from "@/components/settings/password-form"
import { NotificationForm } from "@/components/settings/notification-form"

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm />
        </TabsContent>
        
        <TabsContent value="password" className="space-y-4">
          <PasswordForm />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
