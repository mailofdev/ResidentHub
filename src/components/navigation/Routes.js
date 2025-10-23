// routes.js
import { getDecryptedUser } from "../common/CommonFunctions";

export const getRoutes = () => {
  const user = getDecryptedUser();

  if (!user) return [];

  return [
    // SocietyCare Routes
    ...(user?.role === "Resident"
      ? [
          {
            label: "Dashboard",
            href: "/resident-dashboard",
            icon: "bi-house-door",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "Maintenance Payments",
            href: "/payments",
            icon: "bi-credit-card",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "Complaints",
            href: "/complaints",
            icon: "bi-exclamation-triangle",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "Notices",
            href: "/notices",
            icon: "bi-megaphone",
            showIn: ["sidebar", "topbar"],
          },
        ]
      : []),
    ...(user?.role === "Admin"
      ? [
          {
            label: "Admin Dashboard",
            href: "/admin-dashboard",
            icon: "bi-gear-fill",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "Residents",
            href: "/residents",
            icon: "bi-people-fill",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "All Payments",
            href: "/admin-payments",
            icon: "bi-credit-card",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "All Complaints",
            href: "/admin-complaints",
            icon: "bi-exclamation-triangle",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "Manage Notices",
            href: "/admin-notices",
            icon: "bi-megaphone",
            showIn: ["sidebar", "topbar"],
          },
        ]
      : []),
    
    // Legacy Routes (keeping for backward compatibility)
    ...(user?.role === "Trainer"
      ? [
          {
            label: "Legacy Dashboard",
            href: "/trainer-dashboard",
            icon: "bi-speedometer2",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "View Clients",
            href: "/AllClients",
            icon: "bi-people-fill",
            showIn: ["sidebar", "topbar"],
          },
        ]
      : []),
    ...(user?.role === "Administrator"
      ? [
          {
            label: "Legacy Dashboard",
            href: "/admin-dashboard",
            icon: "bi-gear-fill",
            showIn: ["sidebar", "topbar"],
          },
        ]
      : []),
  ];
};
