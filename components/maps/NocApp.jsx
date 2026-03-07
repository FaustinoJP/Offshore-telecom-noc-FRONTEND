"use client";
import { useEffect, useState } from 'react';
import { api, setToken, getToken, clearToken } from '@/services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

function Badge({ value }) {
  const styles = { Healthy:'#16a34a', Degraded:'#f59e0b', Down:'#dc2626', Open:'#dc2626', Monitoring:'#f59e0b', Investigating:'#f59e0b', Acknowledged:'#f59e0b', Resolved:'#16a34a', Critical:'#dc2626', Major:'#f59e0b', Warning:'#eab308' };
  return <span style={{background:'#f8fafc', color: styles[value] || '#475569', border:'1px solid #e2e8f0', borderRadius:999, padding:'4px 10px', fontSize:12, fontWeight:600}}>{value}</span>;
}

function Panel({ title, children }) { return <div style={{background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:20, boxShadow:'0 1px 2px rgba(0,0,0,.04)'}}><div style={{fontWeight:700, marginBottom:12}}>{title}</div>{children}</div>; }

export default function NocApp() {
  const [tokenReady, setTokenReady] = useState(false);
  const [email, setEmail] = useState('admin@nocsystem.local');
  const [password, setPassword] = useState('admin123');
  const [page, setPage] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [sites, setSites] = useState([]);
  const [links, setLinks] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [events, setEvents] = useState([]);

  async function load() {
    const [s1, s2, s3, s4, s5] = await Promise.all([api.summary(), api.sites(), api.links(), api.alarms(), api.incidents()]);
    const ev = await api.events();
    setSummary(s1.data); setSites(s2.data || []); setLinks(s3.data || []); setAlarms(s4.data || []); setIncidents(s5.data || []); setEvents(ev.data || []);
  }

  useEffect(() => {
    const token = getToken();
    if (token) { setTokenReady(true); load(); }
  }, []);

  useEffect(() => {
    if (!tokenReady) return;
    const socket = io(SOCKET_URL, { transports:['websocket'] });
    socket.on('alarm.created', (p) => { setEvents(v => [{ id:`evt-${Date.now()}`, event:'alarm.created', message:`${p.siteName}: ${p.message}`, time:new Date().toISOString() }, ...v].slice(0,20)); load(); });
    socket.on('alarm.closed', () => load());
    socket.on('site.status.changed', () => load());
    return () => socket.disconnect();
  }, [tokenReady]);

  async function onLogin(e) {
    e.preventDefault();
    const res = await api.login(email, password);
    if (res.success) { setToken(res.data.token); setTokenReady(true); await load(); }
    else alert(res.error?.message || 'Login failed');
  }

  if (!tokenReady) {
    return <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24}}><form onSubmit={onLogin} style={{width:380, background:'#fff', border:'1px solid #e2e8f0', borderRadius:24, padding:24}}><h1 style={{marginTop:0}}>Telecom NOC Login</h1><p style={{color:'#64748b'}}>Use as credenciais iniciais para entrar.</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' style={{width:'100%', padding:12, marginBottom:12, borderRadius:12, border:'1px solid #cbd5e1'}}/><input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' style={{width:'100%', padding:12, marginBottom:12, borderRadius:12, border:'1px solid #cbd5e1'}}/><button style={{width:'100%', padding:12, borderRadius:12, border:0, background:'#0f172a', color:'#fff'}}>Entrar</button></form></div>;
  }

  const nav = [['dashboard','Dashboard'],['network-map','Network Map'],['topology','Topology'],['sites','Sites'],['alarms','Alarms'],['incidents','Incidents']];

  return <div style={{minHeight:'100vh', display:'flex'}}>
    <aside style={{width:260, background:'#020617', color:'#e2e8f0', padding:20}}>
      <div style={{fontSize:12, letterSpacing:2, color:'#7dd3fc', textTransform:'uppercase'}}>NOC Platform</div>
      <h2>Telecom Command</h2>
      <p style={{color:'#94a3b8'}}>Unified operations workspace.</p>
      <div style={{display:'grid', gap:8, marginTop:20}}>{nav.map(([k,l]) => <button key={k} onClick={()=>setPage(k)} style={{textAlign:'left', padding:'12px 14px', borderRadius:16, border:0, background: page===k ? 'rgba(14,165,233,.18)' : 'transparent', color: page===k ? '#bae6fd' : '#cbd5e1'}}>{l}</button>)}</div>
      <button onClick={()=>{clearToken(); location.reload();}} style={{marginTop:24, padding:'10px 14px', borderRadius:12, border:'1px solid #334155', background:'transparent', color:'#fff'}}>Logout</button>
    </aside>
    <main style={{flex:1, padding:24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}><div><div style={{fontSize:14, color:'#64748b'}}>Network Operations Center</div><h1 style={{margin:'6px 0'}}>{nav.find(n=>n[0]===page)?.[1]}</h1></div></div>
      {page==='dashboard' && <div style={{display:'grid', gap:24}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16}}>{summary && [['Total Sites',summary.totalSites],['Healthy',summary.activeSites],['Degraded',summary.degradedSites],['Down',summary.downSites],['Critical',summary.criticalAlarms]].map(([l,v]) => <Panel key={l} title={l}><div style={{fontSize:30, fontWeight:700}}>{v}</div></Panel>)}</div>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:24}}>
          <Panel title='Sites'><div style={{display:'grid', gap:10}}>{sites.map(s => <div key={s.id} style={{display:'flex', justifyContent:'space-between', padding:12, border:'1px solid #e2e8f0', borderRadius:14}}><div><div style={{fontWeight:600}}>{s.name}</div><div style={{fontSize:13, color:'#64748b'}}>{s.region} • {s.technology}</div></div><Badge value={s.status}/></div>)}</div></Panel>
          <Panel title='Live Events'><div style={{display:'grid', gap:10}}>{events.map(e => <div key={e.id} style={{padding:12, border:'1px solid #e2e8f0', borderRadius:14}}><div style={{fontSize:12, color:'#64748b'}}>{e.event}</div><div>{e.message}</div></div>)}</div></Panel>
        </div>
      </div>}
      {page==='sites' && <Panel title='Sites'><table style={{width:'100%', borderCollapse:'collapse'}}><thead><tr>{['Site','Region','Tech','Status','Availability','Alarms'].map(h => <th key={h} style={{textAlign:'left', padding:10, borderBottom:'1px solid #e2e8f0'}}>{h}</th>)}</tr></thead><tbody>{sites.map(s => <tr key={s.id}><td style={{padding:10}}>{s.name}</td><td style={{padding:10}}>{s.region}</td><td style={{padding:10}}>{s.technology}</td><td style={{padding:10}}><Badge value={s.status}/></td><td style={{padding:10}}>{s.availability}%</td><td style={{padding:10}}>{s.activeAlarms}</td></tr>)}</tbody></table></Panel>}
      {page==='alarms' && <Panel title='Alarms'><div style={{display:'grid', gap:10}}>{alarms.map(a => <div key={a.id} style={{padding:12, border:'1px solid #e2e8f0', borderRadius:14}}><div style={{display:'flex', gap:8, marginBottom:6}}><Badge value={a.severity}/><Badge value={a.state}/></div><div style={{fontWeight:600}}>{a.siteId}</div><div style={{color:'#64748b'}}>{a.message}</div></div>)}</div></Panel>}
      {page==='incidents' && <Panel title='Incidents'><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>{incidents.map(i => <div key={i.id} style={{padding:12, border:'1px solid #e2e8f0', borderRadius:14}}><div style={{display:'flex', justifyContent:'space-between'}}><div><div style={{fontSize:12, color:'#64748b'}}>{i.id}</div><div style={{fontWeight:600}}>{i.title}</div></div><Badge value={i.status}/></div><div style={{marginTop:8, color:'#64748b'}}>{i.priority} • {i.owner}</div></div>)}</div></Panel>}
      {page==='network-map' && <Panel title='Network Map'><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>{links.map(l => <div key={l.id} style={{padding:14, border:'1px solid #e2e8f0', borderRadius:14}}><div style={{fontWeight:600}}>{l.name}</div><div style={{color:'#64748b'}}>Type: {l.type}</div><div style={{marginTop:6}}><Badge value={l.status}/></div></div>)}</div><p style={{marginTop:12, color:'#64748b'}}>Mapa simplificado nesta build de deployment. Pode ser trocado pelo componente Leaflet completo sem alterar a shell.</p></Panel>}
      {page==='topology' && <Panel title='Topology'><div style={{display:'grid', gap:10}}>{links.map(l => <div key={l.id} style={{display:'flex', justifyContent:'space-between', padding:12, border:'1px solid #e2e8f0', borderRadius:14}}><div>{l.name}</div><div style={{display:'flex', gap:8}}><span style={{color:'#64748b'}}>{l.utilization}%</span><Badge value={l.status}/></div></div>)}</div><p style={{marginTop:12, color:'#64748b'}}>Topologia simplificada nesta build de deployment. Pode encaixar Cytoscape depois.</p></Panel>}
    </main>
  </div>;
}
