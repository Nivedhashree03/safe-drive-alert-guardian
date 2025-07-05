
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, User, Plus, Trash2 } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

interface EmergencyContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contacts: EmergencyContact[]) => void;
  initialContacts: EmergencyContact[];
}

const EmergencyContactDialog = ({ isOpen, onClose, onSave, initialContacts }: EmergencyContactDialogProps) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);

  const addContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      phone: ''
    };
    setContacts([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const updateContact = (id: string, field: 'name' | 'phone', value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const handleSave = () => {
    const validContacts = contacts.filter(contact => contact.name.trim() && contact.phone.trim());
    onSave(validContacts);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Emergency Contacts</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add emergency contacts who will be notified if you don't respond to sleep alerts.
          </p>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor={`name-${contact.id}`} className="text-xs">Name</Label>
                    <Input
                      id={`name-${contact.id}`}
                      placeholder="Contact name"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`phone-${contact.id}`} className="text-xs">Phone</Label>
                    <Input
                      id={`phone-${contact.id}`}
                      placeholder="+1234567890"
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={addContact}
            className="w-full"
            disabled={contacts.length >= 5}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact {contacts.length >= 5 && '(Max 5)'}
          </Button>
          
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1">
              Save Contacts
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactDialog;
