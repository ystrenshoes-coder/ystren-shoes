"use client";

import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";
import type { AdminUser } from "@/lib/api";

const LOCKED_EMAIL = "santiagoallinarboleda16@gmail.com";

export default function UsersManager({ isAdmin }: { isAdmin: boolean }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

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
      await updateUser(userId, { role: newRole });
      load();
    } catch {}
  }

  async function handleSavePassword(userId: string) {
    if (!newPassword) return;
    setBusyId(userId);
    setError(null);
    try {
      await updateUser(userId, { password: newPassword });
      setPasswordUserId(null);
      setNewPassword("");
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contrasena");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleDisabled(user: AdminUser) {
    if (!confirm(user.disabled ? `Habilitar a ${user.email}?` : `Deshabilitar a ${user.email}?`)) return;
    setBusyId(user.id);
    setError(null);
    try {
      await updateUser(user.id, { disabled: !user.disabled });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el estado");
    } finally {
      setBusyId(null);
    }
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
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {showForm ? "Cancelar" : "Nuevo usuario"}
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {showForm && isAdmin ? (
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
                <option value="colaborador">Colaborador</option>
                <option value="staff">Staff</option>
              </select>
            </div>
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
                <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const locked = user.email === LOCKED_EMAIL;
                return (
                <tr key={user.id} className={user.disabled ? "bg-gray-50 opacity-70" : undefined}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.email}
                    {locked ? (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        Principal
                      </span>
                    ) : null}
                    {user.disabled ? (
                      <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                        Deshabilitado
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        disabled={locked}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="admin">Admin</option>
                        <option value="colaborador">Colaborador</option>
                        <option value="staff">Staff</option>
                      </select>
                    ) : (
                      <span className="text-xs font-semibold text-gray-700">{user.role}</span>
                    )}
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
                    {isAdmin ? (
                      <button
                        type="button"
                        disabled={locked || busyId === user.id}
                        onClick={() => handleToggleDisabled(user)}
                        title={user.disabled ? "Activar usuario" : "Deshabilitar usuario"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition disabled:opacity-50 ${
                          user.disabled ? "bg-gray-300" : "bg-green-500"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                            user.disabled ? "translate-x-1" : "translate-x-6"
                          }`}
                        />
                      </button>
                    ) : (
                      <span className={`text-xs font-semibold ${user.disabled ? "text-gray-500" : "text-green-600"}`}>
                        {user.disabled ? "Deshabilitado" : "Activo"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-2">
                      {isAdmin ? (
                        <>
                          {passwordUserId === user.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="password"
                                minLength={6}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nueva contrasena"
                                className="w-48 rounded-md border border-gray-300 px-2 py-1 text-xs"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  disabled={busyId === user.id}
                                  onClick={() => handleSavePassword(user.id)}
                                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setPasswordUserId(null); setNewPassword(""); }}
                                  className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setPasswordUserId(user.id); setNewPassword(""); }}
                              disabled={busyId === user.id}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                              Cambiar contrasena
                            </button>
                          )}
                        </>
                      ) : null}

                      {locked ? (
                        <span className="text-xs text-gray-400">-</span>
                      ) : isAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id, user.email ?? "")}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      ) : null}
                    </div>
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