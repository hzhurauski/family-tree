using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FamilyTree.Application.Common.Helpers
{
    public static class CollectionsMerger
    {
        public static MergeStatistics Merge<TDst, TSrc, TKey>(
            IEnumerable<TDst> original, IEnumerable<TSrc> updated,
            Func<TDst, TKey> getOriginalKey,
            Func<TSrc, TKey> getUpdatedKey, Action<TSrc> add = null,
            Action<TDst, TSrc> update = null,
            Action<TDst> remove = null)
        {
            original = original?.ToArray() ?? Array.Empty<TDst>();
            updated = updated?.ToArray() ?? Array.Empty<TSrc>();
            MergeStatistics mergeStatistics = new MergeStatistics();
            Dictionary<TKey, TDst> dictionary = original.ToDictionary(getOriginalKey);
            HashSet<TKey> usedKeys = new HashSet<TKey>();
            foreach (TSrc item in updated)
            {
                TKey val = getUpdatedKey(item);
                if (val != null && dictionary.TryGetValue(val, out var value))
                {
                    update?.Invoke(value, item);
                    usedKeys.Add(val);
                    mergeStatistics.Updated++;
                }
                else
                {
                    add?.Invoke(item);
                    mergeStatistics.Added++;
                }
            }

            foreach (TDst item2 in original.Where((TDst i) => !usedKeys.Contains(getOriginalKey(i))))
            {
                remove?.Invoke(item2);
                mergeStatistics.Removed++;
            }

            return mergeStatistics;
        }
    }

    public class MergeStatistics
    {
        public int Added;

        public int Updated;

        public int Removed;

        public override string ToString()
        {
            return $"{Added} new, {Updated} updated, {Removed} removed";
        }

        public void Add(MergeStatistics another)
        {
            Added += another.Added;
            Updated += another.Updated;
            Removed += another.Removed;
        }
    }
}
