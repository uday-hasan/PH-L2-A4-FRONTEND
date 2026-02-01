"use client";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { userApi } from "../api/user.api";
import { UserCard } from "./UserCard";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getAll({
        page,
        search: debouncedSearch,
        limit: 8,
      });
      setUsers(data.data.users);
      setTotalPages(data.data.meta.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, fetchUsers]);

  const handleUpdate = async (id: string, payload: any) => {
    try {
      await userApi.update(id, payload);
      toast.success("User updated");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> User Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor and manage access for Customers and Sellers.
          </p>
        </div>
      </div>

      <div className="flex items-center bg-card p-3 rounded-lg border shadow-sm max-w-md">
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search by name or email..."
          className="border-none shadow-none focus-visible:ring-0 h-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user: any) => (
            <UserCard
              key={user.id}
              user={user}
              onStatusChange={handleUpdate}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
