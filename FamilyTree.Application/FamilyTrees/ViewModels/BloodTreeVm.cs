using System.Collections.Generic;

namespace FamilyTree.Application.FamilyTrees.ViewModels
{
    public class BloodTreeVm
    {
        public List<bool> Grand { get; set; }

        public List<bool> Parent { get; set; }

        public List<bool> Brothers { get; set; }

        public bool Main { get; set; }

        public List<bool> Wifes { get; set; }

        public List<bool> Children { get; set; }

        public bool AnotherChild { get; set; }
    }
}
