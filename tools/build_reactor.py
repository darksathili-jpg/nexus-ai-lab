"""Build a real, self-contained GLB reactor sculpture for NEXUS.
Dependencies: pip install trimesh numpy
Output: public/assets/nexus-core-sculpture.glb
"""
from pathlib import Path
import math
import numpy as np
import trimesh

out=Path("public/assets/nexus-core-sculpture.glb")
out.parent.mkdir(parents=True,exist_ok=True)
scene=trimesh.Scene()
def add(mesh,name,color):
    mesh.visual.vertex_colors=np.tile(np.array(color,dtype=np.uint8),(len(mesh.vertices),1))
    scene.add_geometry(mesh,geom_name=name)
def tube(name,points,r,color):
    for i,(a,b) in enumerate(zip(points[:-1],points[1:])):
        a=np.array(a);b=np.array(b);v=b-a
        if np.linalg.norm(v)<1e-5: continue
        mesh=trimesh.creation.cylinder(radius=r,height=np.linalg.norm(v),sections=8)
        mesh.apply_transform(trimesh.geometry.align_vectors([0,0,1],v))
        mesh.apply_translation((a+b)/2)
        add(mesh,f"{name}_{i}",color)
def torus(name,R,r,y,color):
    n=96;m=12;vertices=[];faces=[]
    for i in range(n):
        t=i*math.tau/n
        for j in range(m):
            u=j*math.tau/m
            vertices.append([(R+r*math.cos(u))*math.cos(t),y+r*math.sin(u),(R+r*math.cos(u))*math.sin(t)])
    for i in range(n):
        for j in range(m):
            a=i*m+j;b=((i+1)%n)*m+j;c=i*m+(j+1)%m;d=((i+1)%n)*m+(j+1)%m
            faces.extend([[a,b,c],[c,b,d]])
    add(trimesh.Trimesh(vertices=vertices,faces=faces,process=False),name,color)
metal=[44,66,82,255];gold=[191,141,89,255];cyan=[53,212,244,255];violet=[125,89,212,255]
for i,(R,r,y,col) in enumerate([(6.5,.26,4,metal),(6.5,.08,4.24,cyan),(5.5,.22,7,metal),(5.5,.07,7.2,gold),(4.2,.16,9.2,metal),(4.2,.06,9.4,cyan)]):
    torus(f"ring_{i}",R,r,y,col)
for j in range(12):
    a=j*math.tau/12
    tube(f"support_{j}",[(math.cos(a)*6.45,4,math.sin(a)*6.45),(math.cos(a)*5.5,7,math.sin(a)*5.5),(math.cos(a)*4.2,9.2,math.sin(a)*4.2)],.085,metal)
nodes=[]
for i in range(130):
    t=i*2.399963;yy=1-2*(i+.5)/130;rr=math.sqrt(1-yy*yy);r=2.15+.18*math.sin(i*.72)
    p=np.array([math.cos(t)*rr*r,6.6+yy*1.65,math.sin(t)*rr*r]);nodes.append(p)
    sphere=trimesh.creation.icosphere(subdivisions=1,radius=.075 if i%8 else .16)
    sphere.apply_translation(p)
    add(sphere,f"neuron_{i}",cyan if i%7 else violet)
for i in range(0,130,2):
    tube(f"synapse_{i}",[nodes[i],nodes[(i+13)%130]],.018,cyan)
out.write_bytes(scene.export(file_type="glb"))
print(f"Created {out} ({out.stat().st_size} bytes)")
