import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getRepository,
  getFiles,
  createFile,
  updateFile,
  deleteFile,
  getCommits,
  createCommit,
} from "../services/api";

import DirectoryTree from "../components/DirectoryTree";

function RepositoryWorkspace() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newFile, setNewFile] = useState({
    name: "",
    path: "",
    content: "",
  });

  const [commits, setCommits] = useState([]);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [committing, setCommitting] = useState(false);
