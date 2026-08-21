"use client";

import { useEffect, useState } from "react";
import { getUsers, createUser, updateUserRole, deleteUser } from "@/lib/api";
import type { AdminUser } from "@/lib/api";

const LOCKED_EMAIL = "santiagoallinarboleda16@gmail.com";

export default function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createUser(email, password, role);
      setEmail("");
      setPassword("");
      setRole("admin");
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeRole(userId: string, newRole: string) {
    try {
      await updateUserRole(userId, newRole);
      load();
    } catch {}
  }

  async function handleDelete(userId: string, userEmail: string) {
    if (!confirm(`Eliminar usuario ${userEmail}?`)) return;
    try {
      await deleteUser(userId);
      load();
    } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            {users.length} {users.length === 1 ? "usuario" : "usuarios"} registrados
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {showForm ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleCreate} className="mb-8 max-w-lg rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Crear usuario
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Correo electronico</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Contrasena</label>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                <option value="admin">Administrador</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-500">Cargando...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Correo</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Rol</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Creado</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Ultimo acceso</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const locked = user.email === LOCKED_EMAIL;
                return (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.email}
                    {locked ? <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Principal</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      disabled={locked}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("es-CO") : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString("es-CO")
                      : "Nunca"}
                  </td>
                  <td className="px-4 py-3">
                    {locked ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : (
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id, user.email ?? "")}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
