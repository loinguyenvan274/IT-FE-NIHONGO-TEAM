import React, { useState, useEffect } from "react";
import styles from "./Thongtincongty.module.css";
import { fetchCompanyProfile } from "../../services/api";

const Thongtincongty = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    industry: "",
    location: "",
    founded: "",
    employees: "",
    headquarters: "",
    bio: "",
    ceo: "",
    projects: [],
    email: "",
    phone: "",
  });

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCompanyProfile();
        const projects = data.cac_du_an
          ? data.cac_du_an.split("\n").map((line, index) => {
              const parts = line.split(": ");
              return {
                id: index + 1,
                name: parts[0] ? parts[0].trim() : line.trim(),
                status: parts[1] ? parts[1].trim() : "Hoàn thành",
              };
            })
          : [];
        const contactLines = data.thong_tin_lien_he
          ? data.thong_tin_lien_he.split("\n")
          : [];
        const email =
          contactLines
            .find((line) => line.startsWith("Email:"))
            ?.split(": ")[1] || "";
        const phone =
          contactLines
            .find((line) => line.startsWith("Phone:"))
            ?.split(": ")[1] || "";
        setCompanyInfo({
          name: data.ten_cong_ty || "",
          industry: data.linh_vuc || "",
          location: data.dia_chi || "",
          founded: data.nam_thanh_lap || "",
          employees: data.so_luong_nhan_vien || "",
          headquarters: data.tru_so_chinh || "",
          bio: data.gioi_thieu || "",
          ceo: "", // not provided in response
          projects,
          email,
          phone,
        });
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };
    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.contentBody}>
          {/* 4. Basic Info & Profile Header */}
          <section className={styles.profileHeaderCard}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>1</div>
              <div className={styles.editIcon}>✎</div>
            </div>
            <div className={styles.basicInfo}>
              <h1 className={styles.companyName}>{companyInfo.name}</h1>
              <div className={styles.companyIndustry}>
                <span>🏢</span> {companyInfo.industry}
              </div>
              <div className={styles.companyLocation}>
                <span>📍</span> {companyInfo.location}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                cursor: "pointer",
              }}
            >
              ✎
            </div>
          </section>

          {/* 5. Info Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Năm thành lập</div>
              <div className={styles.statValue}>{companyInfo.founded}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Số lượng nhân viên</div>
              <div className={styles.statValue}>{companyInfo.employees}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Trụ sở chính</div>
              <div className={styles.statValue}>{companyInfo.headquarters}</div>
            </div>
          </div>

          {/* Bio Section */}
          <section className={styles.bioSection}>
            <h2 className={styles.sectionTitle}>Giới thiệu (Bio)</h2>
            <p>{companyInfo.bio}</p>
          </section>

          {/* 6. Projects & Key Contact */}
          <div className={styles.bottomGrid}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                Dự án đang cung cấp & phát triển
              </h2>
              <div className={styles.projectList}>
                {companyInfo.projects.map((project) => (
                  <div key={project.id} className={styles.projectItem}>
                    <div style={{ fontWeight: 500 }}>{project.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>
                      {project.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Key Contact</h2>
              <div className={styles.contactInfo}>
                <div className={styles.contactDetail}>
                  <span className={styles.contactLabel}>CEO</span>
                  <span className={styles.contactValue}>{companyInfo.ceo}</span>
                </div>
                <div className={styles.contactDetail}>
                  <span className={styles.contactLabel}>Email liên hệ</span>
                  <span className={styles.contactValue}>
                    {companyInfo.email}
                  </span>
                </div>
                <div className={styles.contactDetail}>
                  <span className={styles.contactLabel}>Phone</span>
                  <span className={styles.contactValue}>
                    {companyInfo.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Thongtincongty;
