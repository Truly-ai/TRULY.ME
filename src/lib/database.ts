import { supabase } from './supabase';

// Heartprint Record types and functions
export interface HeartprintEntry {
  id: string;
  user_id: string;
  title: string;
  mood?: string;
  energy_level: number;
  reflection: string;
  created_at: string;
}

export const heartprintService = {
  async getEntries(userId: string): Promise<HeartprintEntry[]> {
    const { data, error } = await supabase
      .from('heartprint_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching heartprint entries:', error);
      throw error;
    }

    return data || [];
  },

  async createEntry(entry: Omit<HeartprintEntry, 'id' | 'created_at'>): Promise<HeartprintEntry> {
    const { data, error } = await supabase
      .from('heartprint_entries')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Error creating heartprint entry:', error);
      throw error;
    }

    return data;
  },

  async updateEntry(id: string, updates: Partial<HeartprintEntry>): Promise<HeartprintEntry> {
    const { data, error } = await supabase
      .from('heartprint_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating heartprint entry:', error);
      throw error;
    }

    return data;
  },

  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('heartprint_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting heartprint entry:', error);
      throw error;
    }
  }
};

// Sacred Journal types and functions
export interface SacredJournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  emotion?: string;
  emotion_icon?: string;
  created_at: string;
}

export const sacredJournalService = {
  async getEntries(userId: string): Promise<SacredJournalEntry[]> {
    const { data, error } = await supabase
      .from('sacred_journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }

    return data || [];
  },

  async createEntry(entry: Omit<SacredJournalEntry, 'id' | 'created_at'>): Promise<SacredJournalEntry> {
    const { data, error } = await supabase
      .from('sacred_journal_entries')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }

    return data;
  },

  async updateEntry(id: string, updates: Partial<SacredJournalEntry>): Promise<SacredJournalEntry> {
    const { data, error } = await supabase
      .from('sacred_journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }

    return data;
  },

  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('sacred_journal_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }
};

// Truly Circles types and functions
export interface TrulyCircleMessage {
  id: string;
  user_id?: string;
  circle_id: string;
  message: string;
  display_name: string;
  reactions: string[];
  replies: Array<{
    id: string;
    text: string;
    timestamp: string;
    display_name: string;
  }>;
  created_at: string;
}

export interface TrulyCircleMembership {
  id: string;
  user_id: string;
  circle_id: string;
  joined_at: string;
}

export const trulyCirclesService = {
  async getMessages(circleId: string): Promise<TrulyCircleMessage[]> {
    const { data, error } = await supabase
      .from('truly_circles_messages')
      .select('*')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching circle messages:', error);
      throw error;
    }

    return data || [];
  },

  async createMessage(message: Omit<TrulyCircleMessage, 'id' | 'created_at'>): Promise<TrulyCircleMessage> {
    const { data, error } = await supabase
      .from('truly_circles_messages')
      .insert([message])
      .select()
      .single();

    if (error) {
      console.error('Error creating circle message:', error);
      throw error;
    }

    return data;
  },

  async updateMessage(id: string, updates: Partial<TrulyCircleMessage>): Promise<TrulyCircleMessage> {
    const { data, error } = await supabase
      .from('truly_circles_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating circle message:', error);
      throw error;
    }

    return data;
  },

  async addReaction(messageId: string, reaction: string): Promise<void> {
    // First get the current message
    const { data: message, error: fetchError } = await supabase
      .from('truly_circles_messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    if (fetchError) {
      console.error('Error fetching message for reaction:', fetchError);
      throw fetchError;
    }

    const currentReactions = message.reactions || [];
    const updatedReactions = [...currentReactions, reaction];

    const { error } = await supabase
      .from('truly_circles_messages')
      .update({ reactions: updatedReactions })
      .eq('id', messageId);

    if (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  async addReply(messageId: string, reply: {
    text: string;
    display_name: string;
  }): Promise<void> {
    // First get the current message
    const { data: message, error: fetchError } = await supabase
      .from('truly_circles_messages')
      .select('replies')
      .eq('id', messageId)
      .single();

    if (fetchError) {
      console.error('Error fetching message for reply:', fetchError);
      throw fetchError;
    }

    const currentReplies = message.replies || [];
    const newReply = {
      id: crypto.randomUUID(),
      text: reply.text,
      timestamp: new Date().toISOString(),
      display_name: reply.display_name
    };
    const updatedReplies = [...currentReplies, newReply];

    const { error } = await supabase
      .from('truly_circles_messages')
      .update({ replies: updatedReplies })
      .eq('id', messageId);

    if (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  },

  // Circle membership functions
  async checkMembership(userId: string, circleId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('truly_circle_memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('circle_id', circleId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking circle membership:', error);
      throw error;
    }

    return !!data;
  },

  async joinCircle(userId: string, circleId: string): Promise<TrulyCircleMembership> {
    const { data, error } = await supabase
      .from('truly_circle_memberships')
      .insert([{ user_id: userId, circle_id: circleId }])
      .select()
      .single();

    if (error) {
      console.error('Error joining circle:', error);
      throw error;
    }

    return data;
  },

  async leaveCircle(userId: string, circleId: string): Promise<void> {
    const { error } = await supabase
      .from('truly_circle_memberships')
      .delete()
      .eq('user_id', userId)
      .eq('circle_id', circleId);

    if (error) {
      console.error('Error leaving circle:', error);
      throw error;
    }
  },

  async getUserMemberships(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('truly_circle_memberships')
      .select('circle_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user memberships:', error);
      throw error;
    }

    return data?.map(membership => membership.circle_id) || [];
  }
};

// Truly Origin feedback types and functions
export interface TrulyOriginFeedback {
  id: string;
  user_id?: string;
  message: string;
  created_at: string;
}

export const trulyOriginService = {
  async getFeedback(): Promise<TrulyOriginFeedback[]> {
    const { data, error } = await supabase
      .from('truly_origin_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }

    return data || [];
  },

  async createFeedback(feedback: Omit<TrulyOriginFeedback, 'id' | 'created_at'>): Promise<TrulyOriginFeedback> {
    const { data, error } = await supabase
      .from('truly_origin_feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }

    return data;
  }
};

// Real-time subscriptions
export const subscribeToCircleMessages = (
  circleId: string,
  callback: (message: TrulyCircleMessage) => void
) => {
  return supabase
    .channel(`circle-${circleId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'truly_circles_messages',
        filter: `circle_id=eq.${circleId}`
      },
      (payload) => {
        callback(payload.new as TrulyCircleMessage);
      }
    )
    .subscribe();
};

export const subscribeToFeedback = (
  callback: (feedback: TrulyOriginFeedback) => void
) => {
  return supabase
    .channel('feedback')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'truly_origin_feedback'
      },
      (payload) => {
        callback(payload.new as TrulyOriginFeedback);
      }
    )
    .subscribe();
};