
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, User, Phone, MapPin, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  fullName: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

const ProfilePage = ({ user, onBack, onUpdateUser }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: 'O+',
    allergies: 'None',
    medications: 'None',
    emergencyMedicalInfo: 'No pre-existing conditions'
  });
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'John Doe', phone: '+1234567890', relationship: 'Spouse' },
    { id: '2', name: 'Jane Smith', phone: '+1234567891', relationship: 'Sibling' },
    { id: '3', name: 'Dr. Wilson', phone: '+1234567892', relationship: 'Doctor' }
  ]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const { toast } = useToast();

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        ...newContact
      };
      setEmergencyContacts([...emergencyContacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      });
    }
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={isEditing ? editedUser.fullName : user.fullName}
                  onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedUser.email : user.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedUser.phone : user.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSaveProfile} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Medical Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  value={medicalInfo.bloodType}
                  onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  value={medicalInfo.allergies}
                  onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Input
                  id="medications"
                  value={medicalInfo.medications}
                  onChange={(e) => setMedicalInfo({ ...medicalInfo, medications: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyMedicalInfo">Emergency Medical Info</Label>
                <Textarea
                  id="emergencyMedicalInfo"
                  value={medicalInfo.emergencyMedicalInfo}
                  onChange={(e) => setMedicalInfo({ ...medicalInfo, emergencyMedicalInfo: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      <Badge variant="secondary" className="text-xs">{contact.relationship}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Contact */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Add New Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactName">Name</Label>
                    <Input
                      id="contactName"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactRelationship">Relationship</Label>
                    <Input
                      id="contactRelationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleAddContact} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
