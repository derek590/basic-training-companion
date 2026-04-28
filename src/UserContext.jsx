import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { toDateOnly } from "./utils";

const UserContext = createContext(null);

const normalizeMemory = m => ({
  id: m.id,
  type: m.type,
  text: m.text,
  photoPreview: m.photo_data,
  photoName: m.photo_name,
  date: new Date(m.created_at).toLocaleDateString(),
});

const normalizeReminder = r => ({ id: r.id, text: r.text, done: !!r.done });

function shape(data) {
  if (!data || !data.user) {
    return {
      user: null,
      branchId: null,
      profile: null,
      memories: [],
      reminders: [],
    };
  }
  const u = data.user;
  return {
    user: {
      id: u.id,
      email: u.email,
      plan: u.plan,
      planStatus: u.plan_status,
      celebDone: !!u.celeb_done,
      notifPrefs: u.notif_prefs || {},
    },
    branchId: u.branch_id || null,
    profile: u.branch_id
      ? {
          recruiterName: u.recruit_name,
          familyName: u.family_name,
          startDate: toDateOnly(u.start_date),
          endDate: toDateOnly(u.end_date),
        }
      : null,
    memories: (data.memories || []).map(normalizeMemory),
    reminders: (data.reminders || []).map(normalizeReminder),
  };
}

export function UserProvider({ children }) {
  const [state, setState] = useState({ loading: true, ...shape(null) });

  const refresh = useCallback(async () => {
    try {
      const data = await api.me();
      setState({ loading: false, ...shape(data) });
    } catch {
      setState({ loading: false, ...shape(null) });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ ...state, refresh, setState }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
export { normalizeMemory, normalizeReminder };
