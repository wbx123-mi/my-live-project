import { ref, onMounted } from 'vue';

interface NoteNode {
  name: string;
  path: string;
  children?: NoteNode[];
  expanded?: boolean;
}

export function useNoteTree() {
  const noteTree = ref<NoteNode[]>([]);
  const isLoading = ref(true);

  const generateTree = () => {
    // 1. 自动扫描 public/notes 下所有的 .md 文件
    // 注意：Vite 的 glob 只能扫描 src 目录或相对于当前文件的路径
    // 如果你的 MD 在 public，建议扫描时使用相对于此文件的路径，或者固定格式
    const modules = import.meta.glob('/public/notes/**/*.md');
    const tree: Record<string, NoteNode> = {};

    Object.keys(modules).forEach((filePath) => {
      // 路径处理逻辑
      const parts = filePath.replace('/public/notes/', '').split('/');

      if (parts.length >= 2) {
        const folderName = parts[0];
        const fileName = parts[1];
        const purePath = `${folderName}/${fileName.replace('.md', '')}`;

        if (!tree[folderName]) {
          tree[folderName] = {
            name: folderName,
            path: folderName,
            expanded: true,
            children: [],
          };
        }

        tree[folderName].children?.push({
          name: fileName,
          path: purePath,
        });
      }
    });

    noteTree.value = Object.values(tree);
    isLoading.value = false;
  };

  onMounted(() => {
    generateTree();
  });

  return {
    noteTree,
    isLoading,
    refreshTree: generateTree, // 暴露一个手动刷新的方法
  };
}
