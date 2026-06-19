import { useState, useEffect } from "react";
import { materialApi } from "../../features/materials/materialApi";
import { categoryApi } from "../../features/categories/categoryApi";
import ConfirmDialog from "../../features/todos/ConfirmDialog";

const initialMaterial = {
  name: "",
  topic: "",
  description: "",
  image: "",
  videoLink: "",
  blocks: [
    {
      title: "",
      example: "",
      paragraph: "",
      list: "",
      listType: "bullet",
      image: "",
    },
  ],
};

const pathToTopic = {
  algoritma: "Algoritma & Pemrograman",
  website: "Pengembangan Website",
  "ui-ux": "Desain UI/UX",
  "data-science": "Data Science",
  ai: "Kecerdasan Buatan",
  mobile: "Pemrograman Mobile",
  "game-dev": "Game Development",
};

const topicToPath = {
  "Algoritma & Pemrograman": "algoritma",
  "Pengembangan Website": "website",
  "Desain UI/UX": "ui-ux",
  "Data Science": "data-science",
  "Kecerdasan Buatan": "ai",
  "Pemrograman Mobile": "mobile",
  "Game Development": "game-dev",
  "Website": "website",
  "UI/UX": "ui-ux",
  "Kecerdasan Buatan (AI)": "ai",
  "Mobile": "mobile",
  "algoritma": "algoritma",
  "website": "website",
  "uiux": "ui-ux",
  "ui-ux": "ui-ux",
  "ai": "ai",
  "mobile": "mobile",
  "game-dev": "game-dev",
  "data-science": "data-science"
};

const mapUserToAdmin = (material) => {
  return {
    id: material.id,
    name: material.name || material.title || "",
    topic: material.topic || pathToTopic[material.path] || material.path || "Pengembangan Website",
    description: material.description || material.desc || "",
    status: material.status || "Aktif",
    image: material.image || "",
    videoLink: material.videoLink || "",
    blocks: material.blocks || [
      {
        title: "",
        example: "",
        paragraph: "",
        list: "",
        listType: "bullet",
        image: "",
      },
    ],
    category_id: material.category_id,
    path: material.path || topicToPath[material.topic] || "website",
  };
};

const mapAdminToUser = (material, categoryMap) => {
  const path = topicToPath[material.topic] || "website";
  const category_id = categoryMap[path];
  return {
    id: material.id,
    name: material.name,
    topic: material.topic,
    description: material.description,
    status: material.status,
    image: material.image,
    videoLink: material.videoLink,
    blocks: material.blocks,
    title: material.name,
    desc: material.description,
    path: path,
    category_id,
  };
};

export default function AdminMateriPage() {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({}); // map from path to category_id
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(initialMaterial);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, materialId: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await categoryApi.getAll();
        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
          // Create mapping from topic/path to category_id
          const map = {};
          for (const cat of categoriesRes.data) {
            const path = topicToPath[cat.name] || cat.name.toLowerCase().replace(/\s+/g, '-');
            map[path] = cat.id;
          }
          setCategoryMap(map);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }

      try {
        // Fetch materials
        const res = await materialApi.getAll();
        if (res.data) {
          setMaterials(res.data.map(mapUserToAdmin));
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setCurrentMaterial(initialMaterial);
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (material) => {
    setCurrentMaterial({
      ...material,
      blocks: material.blocks || [
        {
          title: "",
          example: "",
          paragraph: "",
          list: "",
          listType: "bullet",
          image: "",
        },
      ],
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentMaterial(initialMaterial);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setCurrentMaterial((prev) => ({ ...prev, [field]: value }));
  };

  // Compress image to reduce payload size for NGINX 1MB limit
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Reduce dimensions if image is too large
          const maxDimension = 1200;
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Try different quality levels until size is acceptable
          let quality = 0.8;
          let compressed = canvas.toDataURL("image/jpeg", quality);

          while (compressed.length > 800000 && quality > 0.3) {
            quality -= 0.1;
            compressed = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(compressed);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (field, file) => {
    if (!file) return;
    try {
      const compressedImage = await compressImage(file);
      handleChange(field, compressedImage);
    } catch (error) {
      console.error("Error compressing image:", error);
      // Fallback to original if compression fails
      const reader = new FileReader();
      reader.onload = () => {
        handleChange(field, reader.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockImageFileChange = async (index, file) => {
    if (!file) return;
    try {
      const compressedImage = await compressImage(file);
      setCurrentMaterial((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block, idx) =>
          idx === index ? { ...block, image: compressedImage } : block
        ),
      }));
    } catch (error) {
      console.error("Error compressing block image:", error);
      // Fallback to original if compression fails
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentMaterial((prev) => ({
          ...prev,
          blocks: prev.blocks.map((block, idx) =>
            idx === index ? { ...block, image: reader.result || "" } : block
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMaterial = async (event) => {
    event.preventDefault();
    try {
      const mappedData = mapAdminToUser(currentMaterial, categoryMap);
      if (isEditing) {
        const res = await materialApi.updateMaterial(currentMaterial.id, mappedData);
        if (res.ok || res.status === 200 || res.status === 201) {
          setMaterials(materials.map((item) =>
            item.id === currentMaterial.id ? { ...item, ...currentMaterial } : item
          ));
          closeModal();
        } else {
          alert("Gagal menyimpan: " + (res.error?.message || res.status));
        }
      } else {
        const res = await materialApi.createMaterial(mappedData);
        if (res.ok || res.status === 200 || res.status === 201) {
          const newMaterial = mapUserToAdmin(res.data?.material || res.data || mappedData);
          setMaterials([...materials, { ...newMaterial, id: newMaterial.id || Date.now() }]);
          closeModal();
        } else {
          alert("Gagal menyimpan: " + (res.error?.message || res.status));
        }
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleDeleteMaterial = (id) => {
    setConfirmDelete({ isOpen: true, materialId: id });
  };

  const confirmDeleteAction = async () => {
    const { materialId } = confirmDelete;
    if (!materialId) return;
    try {
      const res = await materialApi.deleteMaterial(materialId);
      if (res.ok || res.status === 200 || res.status === 204) {
        setMaterials(materials.filter((item) => item.id !== materialId));
        setConfirmDelete({ isOpen: false, materialId: null });
      } else {
        alert("Gagal menghapus: " + (res.error?.message || res.status));
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleAddBlock = () => {
    setCurrentMaterial((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { title: "", example: "", paragraph: "", list: "", listType: "bullet", image: "" },
      ],
    }));
  };

  const handleRemoveBlock = (index) => {
    setCurrentMaterial((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, idx) => idx !== index),
    }));
  };

  const handleBlockChange = (index, field, value) => {
    setCurrentMaterial((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, idx) =>
        idx === index ? { ...block, [field]: value } : block
      ),
    }));
  };  return (
    <section>
      {modalOpen ? (
        <div style={{ width: "100%", padding: "0", backgroundColor: "transparent" }}>
          <div className="tambah-materi-container" style={{ maxWidth: "100%", margin: "0" }}>
            <div className="topbar" style={{ marginBottom: "24px" }}>
              <div className="topbar-left">
                <h1>{isEditing ? "Edit Materi" : "Tambah Materi"}</h1>
                <p>{isEditing ? "Perbarui informasi materi pembelajaran" : "Kelola platform pembelajaran Anda"}</p>
              </div>
            </div>

            <form onSubmit={handleSaveMaterial} className="tambah-materi-card">
              <div className="form-grid-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Nama Materi</label>
                  <input
                    type="text"
                    value={currentMaterial.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nama Materi"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Topik (Alur Pembelajaran)</label>
                  <select
                    value={currentMaterial.path}
                    onChange={(e) => {
                      handleChange("path", e.target.value);
                      handleChange("topic", pathToTopic[e.target.value]);
                    }}
                    required
                    style={{ cursor: "pointer", color: currentMaterial.path ? "#111827" : "#9ca3af" }}
                  >
                    <option value="" disabled>Pilih Topik</option>
                    <option value="website"> Pengembangan Website</option>
                    <option value="ui-ux"> Desain UI/UX</option>
                    <option value="data-science"> Data Science</option>
                    <option value="mobile"> Pemrograman Mobile</option>
                    <option value="game-dev">Game Development</option>
                    <option value="ai"> Kecerdasan Buatan</option>
                    <option value="algoritma"> Algoritma &amp; Pemrograman</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Gambar Materi (URL Cover Utama)</label>
                  <div className="file-input-wrapper">
                    <label className="file-input-btn">
                      Pilih File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange("image", e.target.files[0])}
                        style={{ display: "none" }}
                      />
                    </label>
                    <input
                      type="text"
                      className="file-input-text"
                      value={currentMaterial.image}
                      onChange={(e) => handleChange("image", e.target.value)}
                      placeholder="/assets/img/logo.png"
                      style={{ pointerEvents: "auto" }}
                    />
                  </div>
                  {currentMaterial.image && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={currentMaterial.image}
                        alt="Preview Gambar Materi"
                        style={{ width: "100%", maxWidth: "160px", borderRadius: "8px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Link Video Materi</label>
                  <input
                    type="text"
                    value={currentMaterial.videoLink}
                    onChange={(e) => handleChange("videoLink", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div className="form-group form-group-full" style={{ marginBottom: 0 }}>
                  <label>Deskripsi</label>
                  <textarea
                    value={currentMaterial.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Deskripsi"
                    required
                  />
                </div>
              </div>

              <div className="konten-materi-header">
                <h3>Konten Materi</h3>
                <button type="button" className="btn-tambah-blok" onClick={handleAddBlock}>
                  <i className="fa-solid fa-plus"></i> Tambah Blok
                </button>
              </div>

              <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "10px", marginBottom: "24px" }}>
                {currentMaterial.blocks.map((block, index) => (
                  <div key={index} className="block-card">
                    <div className="block-header">
                      <h4>Konten Materi #{index + 1}</h4>
                      <button
                        type="button"
                        className="btn-hapus-blok"
                        onClick={() => handleRemoveBlock(index)}
                      >
                        Hapus Blok
                      </button>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Sub Judul</label>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => handleBlockChange(index, "title", e.target.value)}
                          placeholder="Nama Materi"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Judul Contoh / Penjelasan</label>
                        <select
                          value={block.example}
                          onChange={(e) => handleBlockChange(index, "example", e.target.value)}
                          style={{ cursor: "pointer", color: block.example ? "#111827" : "#9ca3af" }}
                        >
                          <option value="" disabled>Pilih Topik</option>
                          <option value="Pengertian">Pengertian</option>
                          <option value="Contoh">Contoh</option>
                          <option value="Penjelasan">Penjelasan</option>
                          <option value="Langkah-langkah">Langkah-langkah</option>
                        </select>
                      </div>

                      <div className="form-group form-group-full" style={{ marginBottom: 0 }}>
                        <label>Paragraf</label>
                        <textarea
                          value={block.paragraph}
                          onChange={(e) => handleBlockChange(index, "paragraph", e.target.value)}
                          placeholder="Deskripsi"
                        />
                      </div>

                      <div className="form-group form-group-full" style={{ marginBottom: 0 }}>
                        <label>Point - Point (Opsional, pisahkan baris baru)</label>
                        <textarea
                          value={block.list || ""}
                          onChange={(e) => handleBlockChange(index, "list", e.target.value)}
                          placeholder="Point 1&#10;Point 2&#10;Point 3"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Jenis List</label>
                        <input
                          type="text"
                          value={block.listType || ""}
                          onChange={(e) => handleBlockChange(index, "listType", e.target.value)}
                          placeholder="Jenis List"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Gambar Blok (URL Cover Utama)</label>
                        <div className="file-input-wrapper">
                          <label className="file-input-btn">
                            Pilih File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBlockImageFileChange(index, e.target.files[0])}
                              style={{ display: "none" }}
                            />
                          </label>
                          <input
                            type="text"
                            className="file-input-text"
                            value={block.image || ""}
                            onChange={(e) => handleBlockChange(index, "image", e.target.value)}
                            placeholder="/assets/img/logo.png"
                            style={{ pointerEvents: "auto" }}
                          />
                        </div>
                        {block.image && (
                          <div style={{ marginTop: "10px" }}>
                            <img
                              src={block.image}
                              alt={`Preview Blok ${index + 1}`}
                              style={{ width: "100%", maxWidth: "160px", borderRadius: "8px", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "24px" }}>
                <button type="button" className="btn-batal" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn-simpan">
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // List View Mode
        <>
          <div className="topbar">
            <div className="topbar-left">
              <h1>Kelola Materi</h1>
              <p>Kelola platform pembelajaran Anda</p>
            </div>
          </div>

          <section className="section-card section-card--no-bg">
            <div className="section-header">
              <div>
                <h2>Kelola Materi Pembelajaran</h2>
              </div>
              <button className="btn btn-primary" onClick={openAddModal}>
                + Tambah Materi
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Materi</th>
                    <th>Topik</th>
                    <th>Deskripsi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id}>
                      <td>{material.name}</td>
                      <td>{material.topic}</td>
                      <td>{material.description}</td>
                      <td>
                        <span className={`status-badge ${
                          material.status === "Aktif" ? "status-active" : "status-inactive"
                        }`}> 
                          {material.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(material)}
                        >
                          Edit
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteMaterial(material.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ConfirmDialog
            isOpen={confirmDelete.isOpen}
            title="Hapus Materi"
            message="Apakah Anda yakin ingin menghapus materi ini? Seluruh data di dalamnya akan terhapus dan tidak dapat dikembalikan."
            onConfirm={confirmDeleteAction}
            onCancel={() => setConfirmDelete({ isOpen: false, materialId: null })}
          />
        </>
      )}
    </section>
  );
}
