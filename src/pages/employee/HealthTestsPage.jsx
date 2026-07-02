import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getTestTypes, getMyTests, addTest, updateTest, deleteTest } from "../../api/tests";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { DashTable } from "../../components/dashboard/DashTable";

export default function HealthTestsPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTypeId, setNewTypeId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newResult, setNewResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editKey, setEditKey] = useState(null);
  const [editResult, setEditResult] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getMyTests(user.u_id), getTestTypes()])
      .then(([mine, allTypes]) => { setTests(mine); setTypes(allTypes); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- load() sets loading state ahead of the fetch it performs; intentionally run once on mount only
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTypeId || !newDate || !newResult) return;
    setSubmitting(true);
    try {
      await addTest(newTypeId, newDate, newResult);
      setNewTypeId("");
      setNewDate("");
      setNewResult("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (t) => {
    setEditKey(`${t.tt_t_id}-${t.tt_u_id}-${t.tt_testDate.slice(0, 10)}`);
    setEditResult(t.tt_result);
  };

  const handleSaveEdit = async (t) => {
    await updateTest(t.tt_t_id, t.tt_u_id, t.tt_testDate.slice(0, 10), editResult);
    setEditKey(null);
    load();
  };

  const handleDelete = async (t) => {
    await deleteTest(t.tt_t_id, t.tt_u_id, t.tt_testDate.slice(0, 10));
    load();
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>My <em>Health Tests</em></h1>

      {tests.length === 0 && <EmptyState message="No health tests on file yet." />}
      {tests.length > 0 && (
        <DashTable columns={["Test", "Date", "Result", ""]}>
          {tests.map((t) => {
            const key = `${t.tt_t_id}-${t.tt_u_id}-${t.tt_testDate.slice(0, 10)}`;
            return (
              <tr key={key}>
                <td>{t.t_name}</td>
                <td>{t.tt_testDate.slice(0, 10)}</td>
                <td>
                  {editKey === key
                    ? <input className="auth-inp" value={editResult} onChange={(e) => setEditResult(e.target.value)} />
                    : t.tt_result}
                </td>
                <td>
                  {editKey === key ? (
                    <>
                      <button className="btn-gold" onClick={() => handleSaveEdit(t)}>Save</button>{" "}
                      <button className="btn-ghost" onClick={() => setEditKey(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-ghost" onClick={() => startEdit(t)}>Edit</button>{" "}
                      <button className="btn-ghost" onClick={() => handleDelete(t)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </DashTable>
      )}

      <h2 className="dash-card-title" style={{ margin: "1.8rem 0 1rem" }}>Add Test Result</h2>
      <form className="auth-form" style={{ maxWidth: 480, flexDirection: "row", alignItems: "flex-end", gap: ".7rem" }} onSubmit={handleAdd}>
        <div className="auth-fg" style={{ flex: 1 }}>
          <label className="auth-lbl">Test</label>
          <select className="auth-inp" value={newTypeId} onChange={(e) => setNewTypeId(e.target.value)}>
            <option value="">Select</option>
            {types.map((t) => <option key={t.t_id} value={t.t_id}>{t.t_name}</option>)}
          </select>
        </div>
        <div className="auth-fg">
          <label className="auth-lbl">Date</label>
          <input className="auth-inp" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </div>
        <div className="auth-fg" style={{ flex: 1 }}>
          <label className="auth-lbl">Result</label>
          <input className="auth-inp" value={newResult} onChange={(e) => setNewResult(e.target.value)} placeholder="Pass" />
        </div>
        <button className="auth-submit" type="submit" disabled={submitting} style={{ marginTop: 0 }}>Add</button>
      </form>
    </div>
  );
}
